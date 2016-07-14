/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
const util = require('util');
import chalk from 'chalk';
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

const conlog = (...msgs) => console.log(chalk.blue.bold(...msgs));
const conwarn = (...msgs) => console.warn(chalk.magenta.bold(...msgs));
const conerr = (...msgs) => console.error(chalk.blue.inverse.white.bold(...msgs));

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
    conlog('OSC socket/opened');
    resolve('opened');
  });
  socket.on('error', err => {
    conerr('OSC socket/error', err);
    resolve(err);
  });
  socket.on('closed', () => {
    conwarn('OSC socket/closed');
    resolve('closed');
  });
  socket.on('osc', event => {
    const res = {
      type: OSC_RECV,
      ...event
    };
    conlog('OSC socket/receive', util.inspect(res));
    resolve(res);
  });
  return {
    nextMessage: () => (messageQueue.length ?
                     cancellablePromise(Promise.resolve(messageQueue.shift()))
      : cancellablePromise(new Promise(resolver => resolveQueue.push(resolver))))
  };
};

// FIXME: Replace with explicit whitelisting of all accepted OSC verbs in oscHandlers.js.
const defaultOscHandler = msg => ({
  type: msg.addr,
  payload: (msg.args.length === 1) ? msg.args[0] : msg.args
});

function* fetchSocket(source) {
  try {
    conlog('* OSC fetchSocket');

    let msg = yield call(source.nextMessage);
    while (msg) {
      if (msg.type && msg.type === OSC_RECV) {
        let action = null;
        if (oscHandlers.hasOwnProperty(msg.addr)) {
          action = oscHandlers[msg.addr](msg);
          conlog('using OSC/RECV handler for msg:', util.inspect(msg), '=>', action);
        } else {
          conwarn('using default OSC/RECV handler for msg:', util.inspect(msg));
          action = defaultOscHandler(msg);
        }
        if (action) {
          conlog('> OSC put', util.inspect(action));
          yield put(action);
        }
      } else if (msg === 'opened') {
        yield put({ type: SOCKET_OPENED });
      } else if (msg === 'closed') {
        yield put({ type: SOCKET_CLOSED });
      } else {
        conwarn('unknown message type on OSC socket', msg);
        yield put({ type: SOCKET_ERROR, error: msg });
      }

      msg = yield call(source.nextMessage);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      conerr('* OSC fetchSocket error', error);
    }
  }
}

function* oscSaga(...args) {
  if (args.length < 2) {
    throw new Error('*oscSaga requires second parameter to be a Socket instance');
  }
  conlog('* oscSaga');

  yield take('/plask/INIT');
  conlog('* oscSaga/INIT');

  const socket = args[1];
  const source = oscSource(socket);

  let awaitOpen = false;
  const active = true;
  while (active) {
    if (awaitOpen) { // Await user-initiated open socket request.
      yield take(SOCKET_OPEN);
      conlog(SOCKET_OPEN);
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
    conwarn('***** oscSaga race!', winner, fetchTask.isRunning());

    // Cancel fetch & send.
    conwarn('cancelling socket fetch');
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
