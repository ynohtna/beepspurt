/* eslint-disable no-console */
import createSagaMiddleware, { isCancelError } from 'redux-saga';
import { call, cancel, fork, put, race, take } from 'redux-saga/effects';
import { cancellablePromise, delayedResolve, endpointFromWindowLocation } from '../utils';

// Socket notifications.
const SOCKET_OPENED = '/socket/OPENED';
const SOCKET_CLOSED = '/socket/CLOSED';
const SOCKET_ERRORED = '/socket/ERROR';
const SOCKET_RECV = '/socket/RECV';
const PONG_RECV = '/socket/PONG';

// Socket manipulation requests.
export const OPEN_SOCKET = '/socket/OPEN';
export const CLOSE_SOCKET = '/socket/CLOSE';
export const SEND_SOCKET = '/socket/SEND';

// Socket status updates.
const SET_SOCKET_STATUS = '/socket/SET_STATUS';
const SET_PING_INFO = '/socket/SET_PING_INFO';

const actionCreators = {
  setSocketStatus: status => ({ type: SET_SOCKET_STATUS, status }),
  sendSocket: (addr, ...args) => ({ type: SEND_SOCKET, addr, args }),
  sendPing: (...args) => ({ type: SEND_SOCKET, addr: '/ping', args }),
  setPingInfo: info => ({ type: SET_PING_INFO, info }),
  openSocket: () => ({ type: OPEN_SOCKET })
};

// FIXME: Replace with a check for action having a truthy 'dontLog' field.
const dontLog = {
  '/ping': true,
  '/pong': true
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
    console.log('%c socket/opened', 'color: green');
    resolve('opened');
  };
  websocket.onerror = err => {
    console.error('socket/error', err);
    resolve('error');
  };
  websocket.onclose = e => {
    // TODO: convert code into reason text as per:
    //       https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    console.warn('socket/closed [reason, code]', e.reason, e.code);
    resolve('closed');
  };
  websocket.onmessage = msg => {
//    console.log('socket/receive [origin, data]', msg.origin, msg.data);
    try {
      let { data } = msg;
      data = JSON.parse(data);
      const res = {
        type: SOCKET_RECV,
        ...data
      };
      if (data.addr === '*HIHO*' && data.id) {
        websocket.socket_id = data.id;
      }
      resolve(res);
    } catch (ex) {
      console.error(msg, ex);
    }
  };
  return {
    nextMessage: () => (messageQueue.length ?
                        cancellablePromise(Promise.resolve(messageQueue.shift()))
        : cancellablePromise(new Promise(resolver => resolveQueue.push(resolver))))
  };
};

const noopAction = {};
const noop = () => noopAction;

const handlers = {
  '*HIHO*': noop, // TODO: Capture this connection's { id } as part of this provider's state.
  '/pong': ({ args }) => ({ type: PONG_RECV, args, dontLog: true }),
  '/renderer/STATE': ({ args }) => ({ type: '/renderer/STATE', payload: args, root: true }),
  '/photo/LIST': ({ args }) => ({ type: '/photo/LIST', photolist: args })
};

function* fetchSocket(source) {
  try {
    console.log('* fetchSocket');
    const setStatus = status => put(actionCreators.setSocketStatus(status));

    let msg = yield call(source.nextMessage);
    while (msg) {
      if (!(msg.addr in dontLog)) {
        console.log('%c :::: MSG', 'color: gold', msg);
      }
      if (msg.type && msg.type === SOCKET_RECV) {
        let action;
        // Sanitize remote actions against registered handlers.
        if (msg.addr && msg.addr in handlers) {
          // Lookup action creator associated with the incoming OSC address.
          action = handlers[msg.addr](msg);
        }
        if (action) {
          if (action !== noopAction) {
            if (!action.dontLog) {
              console.log('%c >:>|', 'color: orange', action);
            }
            yield put(action);
          }
        } else {
          console.error('^^^^^ UNHANDLED SOCKET MESSAGE !!!!!!\n');
        }
      } else if (msg === 'opened') {
        yield setStatus('open');
        yield put({ type: SOCKET_OPENED });
      } else if (msg === 'closed') {
        yield setStatus('closed');
        yield put({ type: SOCKET_CLOSED });
      } else if (msg === 'error') {
        yield setStatus('error');
        yield put({ type: SOCKET_ERRORED, error: msg });
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

const nullArgs = [];
const mungeArgs = args => ((args.length === 1) ? args[0] : args);

function *sendSocket(websocket) {
  try {
    yield take(SOCKET_OPENED);

    const send = true;
    while (send) {
      const msg = yield take(SEND_SOCKET);
      const { addr, args = nullArgs } = msg;
      const id = websocket.socket_id;
      const data = JSON.stringify({ addr, args: mungeArgs(args), id });
      if (!(addr in dontLog)) {
        console.log('%c > socketSend', 'color: sienna', data);
      }
      websocket.send(data);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*sendSocket error', error);
    }
  }
}

function *pingSocket(/* websocket */) {
  try {
    yield take(SOCKET_OPENED);

    yield put(actionCreators.setPingInfo(-2));	// Awaiting initial ping.

    // Wait 1 second after socket has opened before starting to ping.
    yield delayedResolve(1 * 1000);

    const pingActive = true;
    while (pingActive) {
      const pingFrame = (Math.random() * 0xffffffff) | 0;
      yield put(actionCreators.sendPing(pingFrame));

      let level = 0;
      while (level < 10) {
        yield put(actionCreators.setPingInfo(level));
        const { pong } = yield race({
          pong: take(PONG_RECV),
          timeout: delayedResolve(100)
        });
        if (pong) {
          // Check for identical pingFrame.
          if (pingFrame === pong.args) {
//            console.log(`@! pong !@ ${pingFrame} ${level}`);
            break;
          }
        } else {
          level = level + 1;
        }
      }
      if (level >= 10) {
        console.warn('!!! PING TIMEOUT !!!', level);
      }

      yield put(actionCreators.setPingInfo(level));

      // Wait 3 seconds between subsequent ping transmissions.
      yield delayedResolve(3 * 1000);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*pingSocket error', error);
    }
  }
}

function* rootSaga() {
  if (!window.WebSocket) {
    throw new Error('WebSocket support required!');
  }

  const active = true;
  let awaitOpen = false;

  while (active) {
    if (awaitOpen) {
      yield take(OPEN_SOCKET);
      console.log('%c ::: OPEN_SOCKET', 'color: green');
    }
    yield put(actionCreators.setSocketStatus('opening'));

    const endpoint = endpointFromWindowLocation(window.location);
    console.log(`%c :::: WS connecting to endpoint ${endpoint}`, 'color: green');

    const socket = new window.WebSocket(endpoint);
    const source = socketSource(socket);

    const fetchTask = yield fork(fetchSocket, source);
    const sendTask = yield fork(sendSocket, socket);
    const pingTask = yield fork(pingSocket, socket);

    // Race: didClose, close, error, open.
    const winner = yield race({
      didClose: take(SOCKET_CLOSED),
      erred: take(SOCKET_ERRORED),
      close: take(CLOSE_SOCKET),
      open: take(OPEN_SOCKET)
    });
    console.log('%c **** socketSaga race!', 'color: grey',
                winner,
                fetchTask.isRunning(), sendTask.isRunning(), pingTask.isRunning());

    // Close socket if didClose didn't win race.
    if (!winner.didClose) {
      socket.close();
    }

    // Cancel fetch, send & ping.
//    console.log('cancelling socket ping');
    yield cancel(pingTask);

//    console.log('cancelling socket fetch');
    yield cancel(fetchTask);

//    console.log('cancelling socket send');
    yield cancel(sendTask);

    // Update socket & ping status.
    yield put(actionCreators.setSocketStatus('closed'));
    yield put(actionCreators.setPingInfo(-1));

    // If socket closed or errored then await new open request
    // from direct user interaction.
    awaitOpen = !winner.open;
  }
}

const middleware = createSagaMiddleware(rootSaga);

const actions = {
  ...actionCreators
};

const reducers = {
  masterState(state = { state: 'unknown' }, action) {
    switch (action.type) {
      case '/renderer/STATE': {
//        console.error('MERGE_STATE ()()()()()', state, action);
        const r = {
          ...state,
          ...action.payload
        };
//        console.warn('    {{{{ post-merge master state', r);
        return r;
      }
      default:
        return state;
    }
  },
  pingInfo(state = -1, action) {
    switch (action.type) {
      case SET_PING_INFO:
//        console.log(action);
        return action.info;
      default:
        return state;
    }
  },
  socketStatus(state = 'unknown', action) {
    switch (action.type) {
      case SET_SOCKET_STATUS:
//        console.log(action);
        return action.status;
      default:
        return state;
    }
  },
  photoList(state = [], action) {
    switch (action.type) {
      case '/photo/LIST':
        return action.photolist || [];
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
