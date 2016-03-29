/* eslint-disable no-console */
import createSagaMiddleware, { isCancelError } from 'redux-saga';
import { call, cancel, fork, put, race, take } from 'redux-saga/effects';
import { cancellablePromise, endpointFromWindowLocation } from '../utils';

// Socket notifications.
const SOCKET_OPENED = '/socket/OPENED';
const SOCKET_CLOSED = '/socket/CLOSED';
const SOCKET_ERROR = '/socket/ERROR';
const SOCKET_RECV = '/socket/RECV';

// Socket manipulation requests.
export const OPEN_SOCKET = '/socket/OPEN';
export const CLOSE_SOCKET = '/socket/CLOSE';

/* eslint no-param-reassign: [2, {"props": false }] */
const socketSource = websocket => {
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
  websocket.onopen = () => {
    console.log('socket/opened');
    resolve('opened');
  };
  websocket.onerror = err => {
    console.log('socket/error', err);
    resolve(err);
  };
  websocket.onclose = e => {
    console.log('socket/closed', e);
    resolve('closed');
  };
  websocket.onmessage = msg => {
    console.log('socket/receive', msg);
    const { data } = msg;
    const res = {
      type: SOCKET_RECV,
      data
    };
    resolve(res);
  };
  return {
    nextMessage: () => (messageQueue.length ?
                        cancellablePromise(Promise.resolve(messageQueue.shift()))
        : cancellablePromise(new Promise(resolver => resolveQueue.push(resolver))))
  };
};

function* fetchSocket(source) {
  try {
    console.log('* fetchSocket');

    let msg = yield call(source.nextMessage);
    while (msg) {
      if (msg.type && msg.type === SOCKET_RECV) {
        console.log(':::: MSG', msg);
/*
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
*/
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

function* rootSaga() {
  if (!window.WebSocket) {
    throw new Error('WebSocket support required!');
  }

  console.log('***** socketSaga');

  const active = true;
  let awaitOpen = false;

  while (active) {
    if (awaitOpen) {
      yield take(OPEN_SOCKET);
      console.log('::: OPEN_SOCKET');
    }

    const endpoint = endpointFromWindowLocation(window.location);
    console.log(`:::: WS connecting to endpoint ${endpoint}`);

    const ws = new window.WebSocket(endpoint);
    const source = socketSource(ws);
    const fetchTask = yield fork(fetchSocket, source);

    // Race: didClose, close, error, open.
    const winner = yield race({
      didClose: take(SOCKET_CLOSED),
      erred: take(SOCKET_ERROR),
      close: take(CLOSE_SOCKET),
      open: take(OPEN_SOCKET)
    });
    console.log('**** socketSaga race!', winner, fetchTask.isRunning());

    // Cancel fetch & send.
    console.log('cancelling socket fetch');
    yield cancel(fetchTask);

    // TODO: Dispatch socket status: winner.

    // Close if didClose didn't win race.
    if (!winner.didClose) {
      ws.close();
    }

    // If socket closed or errored then await new open request, i.e. from direct user intervention.
    awaitOpen = !winner.open;
  }
}

const middleware = createSagaMiddleware(rootSaga);

const reducers = {
  socketStatus(state = '?', action) {
    switch (action.type) {
      default:
        return state;
    }
  }
};

export default {
  reducers,
  middleware
};
