/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
import { effects, isCancelError } from 'redux-saga';
const { call, cancel, fork, put, race, take } = effects;

import { cancellablePromise } from '../utils';
import oscHandlers from './oscHandlers';

// Socket notifications.
const OSC_RECV = '/osc/RECV';
const SOCKET_OPENED = '/socket/OPENED';
const SOCKET_CLOSED = '/socket/CLOSED';
const SOCKET_ERROR = '/socket/ERROR';

// Socket manipulation requests.
const SOCKET_OPEN = '/socket/OPEN';
const SOCKET_CLOSE = '/socket/CLOSE';

const oscSource = socket => {
  const messageQueue = [];
  const resolveQueue = [];
  const resolve = msg => {
    if (resolveQueue.length) {
      const nextResolve = resolveQueue.shift();
      nextResolve(msg);
    } else {
      messageQueue.push(msg);
    }
  };
  socket.on('opened', () => {
    console.log('socket/opened');
    resolve('opened');
  });
  socket.on('error', err => {
    console.log('socket/error', err);
    resolve(err);
  });
  socket.on('closed', () => {
    console.log('socket/closed');
    resolve('closed');
  });
  socket.on('osc', event => {
    const res = {
      type: OSC_RECV,
      ...event
    };
    console.log('socket/receive', res);
    resolve(res);
  });
  return {
    nextMessage: () => (messageQueue.length ?
                     cancellablePromise(Promise.resolve(messageQueue.shift()))
      : cancellablePromise(new Promise(resolver => resolveQueue.push(resolver))))
  };
};

const handlers = {
  '*': msg => ({
    type: msg.addr,
    payload: (msg.args.length === 1) ? msg.args[0] : msg.args
  }),
  ...oscHandlers
};

function* fetchSocket(source) {
  try {
    console.log('* fetchSocket');

    let msg = yield call(source.nextMessage);
    while (msg) {
      if (msg.type && msg.type === OSC_RECV) {
        let action = null;
        if (handlers.hasOwnProperty(msg.addr)) {
          action = handlers[msg.addr](msg);
        } else {
          console.warn('default osc/RECV handler', msg);
          action = handlers['*'](msg);
        }
        if (action) {
          console.log('> put', action);
          yield put(action);
        }
      } else if (msg === 'opened') {
        yield put({ type: SOCKET_OPENED });
      } else if (msg === 'closed') {
        yield put({ type: SOCKET_CLOSED });
      } else {
        console.warn('unknown message type on socket', msg);
        yield put({ type: SOCKET_ERROR, error: msg });
      }

      msg = yield call(source.nextMessage);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*fetchSocket error', error);
    }
  }
}

function* oscSaga(...args) {
  if (args.length < 2) {
    throw new Error('*oscSaga requires second parameter to be a Socket instance');
  }
  console.log('* oscSaga');

  yield take('/plask/INIT');
  console.log('* oscSaga/INIT');

  const socket = args[1];
  const source = oscSource(socket);

  let awaitOpen = false;
  const active = true;
  while (active) {
    if (awaitOpen) { // Await user-initiated open socket request.
      yield take(SOCKET_OPEN);
      console.log(SOCKET_OPEN);
    }

    // Fork socket fetching.
    const fetchTask = yield fork(fetchSocket, source);

    // Open socket.
    socket.open();

    // TODO: Fork socket sending.

    // Race: didClose, close, error, open.
    const winner = yield race({
      didClose: take(SOCKET_CLOSED),
      erred: take(SOCKET_ERROR),
      close: take(SOCKET_CLOSE),
      open: take(SOCKET_OPEN)
    });
    console.log('***** oscSaga race!', winner, fetchTask.isRunning());

    // Cancel fetch & send.
    console.log('cancelling socket fetch');
    yield cancel(fetchTask);

    // TODO: Dispatch socket status: winner.

    // Close if didClose didn't win race.
    if (!winner.didClose) {
      socket.close();
    }

    // If socket closed or errored then await new open request, i.e. from direct user intervention.
    awaitOpen = !winner.open;
  }
}
export default oscSaga;
