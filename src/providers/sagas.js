/* eslint-disable no-console */
import { createSagaMiddleware, effects } from 'redux-saga';
const { take } = effects;

function* saga() {
  console.log('!SAGA');
  const init = yield take('plask/INIT');
  console.log('!SAGA INIT', init);

//  const active = true;
  const active = false;
  while (active) {
    const frame = yield take('renderer/FRAME_ADVANCE');
    console.log(frame);
  }
}

const sagaMiddleware = createSagaMiddleware(saga);
export default sagaMiddleware;
