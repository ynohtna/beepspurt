/* eslint-disable no-console */
import createSagaMiddleware, { isCancelError } from 'redux-saga';
import { call, cancel, fork, put, race, take } from 'redux-saga/effects';
import { cancellablePromise, endpointFromWindowLocation } from '../utils';

// Socket notifications.
const SOCKET_OPENED = '/socket/OPENED';
const SOCKET_CLOSED = '/socket/CLOSED';
const SOCKET_ERRORED = '/socket/ERROR';
const SOCKET_RECV = '/socket/RECV';

// Socket manipulation requests.
export const OPEN_SOCKET = '/socket/OPEN';
export const CLOSE_SOCKET = '/socket/CLOSE';
export const SEND_SOCKET = '/socket/SEND';

const SET_SOCKET_STATUS = '/socket/SET_STATUS';

const actionCreators = {
  setSocketStatus: status => ({ type: SET_SOCKET_STATUS, status }),
  sendSocket: (addr, ...args) => ({ type: SEND_SOCKET, addr, args })
};

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
    // TODO: convert code into reason text as per:
    //       https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    console.log('socket/closed [reason, code]', e.reason, e.code);
    resolve('closed');
  };
  websocket.onmessage = msg => {
    console.log('socket/receive [origin, data]', msg.origin, msg.data);
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
    const setStatus = status => put(actionCreators.setSocketStatus(status));

    let msg = yield call(source.nextMessage);
    while (msg) {
      if (msg.type && msg.type === SOCKET_RECV) {
        console.log(':::: MSG', msg);
      } else if (msg === 'opened') {
        yield setStatus('open');
        yield put({ type: SOCKET_OPENED });
      } else if (msg === 'closed') {
        yield setStatus('closed');
        yield put({ type: SOCKET_CLOSED });
      } else {
        console.warn('unknown message type on socket', msg);
        yield setStatus('error');
        yield put({ type: SOCKET_ERRORED, error: msg });
      }

      msg = yield call(source.nextMessage);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*fetchSocket error', error);
    }
  }
}

function *sendSocket(websocket) {
  try {
    yield take(SOCKET_OPENED);
    const send = true;
    while (send) {
      const msg = yield take(SEND_SOCKET);
      const { addr, args } = msg;
      const data = args.length > 1 ? JSON.stringify({ addr, args })
        : JSON.stringify({ addr, args: args[0] });
      console.log('> socketSend', data);
      websocket.send(data);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*sendSocket error', error);
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

    const socket = new window.WebSocket(endpoint);
    const source = socketSource(socket);

    const fetchTask = yield fork(fetchSocket, source);
    const sendTask = yield fork(sendSocket, socket);

    // Race: didClose, close, error, open.
    const winner = yield race({
      didClose: take(SOCKET_CLOSED),
      erred: take(SOCKET_ERRORED),
      close: take(CLOSE_SOCKET),
      open: take(OPEN_SOCKET)
    });
    console.log('**** socketSaga race!', winner, fetchTask.isRunning());

    // Close socket if didClose didn't win race.
    if (!winner.didClose) {
      socket.close();
    }
    yield put(actionCreators.setSocketStatus('closed'));

    // Cancel fetch & send.
    console.log('cancelling socket fetch');
    yield cancel(fetchTask);

    console.log('cancelling socket send');
    yield cancel(sendTask);

    // TODO: Dispatch socket status: winner.

    // If socket closed or errored then await new open request, i.e. from direct user intervention.
    awaitOpen = !winner.open;
  }
}

const middleware = createSagaMiddleware(rootSaga);

const actions = {
  ...actionCreators
};

const reducers = {
  socketStatus(state = '?', action) {
    switch (action.type) {
      case SET_SOCKET_STATUS:
        console.log(SET_SOCKET_STATUS, action);
        return action.status || state;
      default:
        return state;
    }
  }
};

export default {
  actionCreators,
  actions,
  reducers,
  middleware
};
