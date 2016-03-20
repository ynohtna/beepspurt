/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
import { createSagaMiddleware, effects, isCancelError } from 'redux-saga';
import { cancellablePromise } from '../utils';

const { call, cancel, fork, put, race, take } = effects;

const oscSource = (socket, osc) => {
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
  socket.onopen = () => {
    console.log('socket.onopen');
    resolve('opened');
  };
  socket.onerror = err => {
    console.log('socket.onerror', err);
    resolve(err);
  };
  socket.onclose = () => {
    console.log('socket.onclose');
    resolve('closed');
  };
  socket.receive = (addr, tags, args) => {
    const res = { type: 'osc/RECV', addr, tags, args };
    console.log('socket.receive', res);
    resolve(res);
  };
  return {
    nextMessage: () => messageQueue.length ?
                     cancellablePromise(Promise.resolve(messageQueue.shift()))
      : cancellablePromise(new Promise(resolver => resolveQueue.push(resolver)))
  };
};

function* fetchSocket(source) {
  try {
    let msg = yield call(source.nextMessage);
    while (msg) {
      console.log(msg);
      // put, or update parent of status.
      msg = yield call(source.nextMessage);
      yield put({ type: 'socket/ERROR', error: msg });
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*fetchSocket error', error);
    }
  }
}

function* saga() {
  console.log('!SAGA');
  const init = yield take('plask/INIT');
  console.log('!SAGA INIT', init);

  const source = oscSource(socket, osc);

  const active = true;
  while (active) {
    // Open socket.
    socket.open();

    // Await successful open response.
    yield take('socket/OPEN');

    // Fork socket fetching.
    const fetchTask = yield fork(fetchSocket, source);

    // Fork socket sending.

    // Race: dicClose, close, error.
    const winner = yield race({
      didClose: take('socket/CLOSED'),
      close: take('socket/CLOSE'),
      erred: take('socket/ERROR')
    });

    // Cancel fetch & send.
    yield cancel(fetchTask);

    // Dispatch status: winner.

    // Close if didClose didn't win race.
    if (!winner.didClose) {
      socket.close();
    }
  }
}

const sagaMiddleware = createSagaMiddleware(saga);
export default sagaMiddleware;
