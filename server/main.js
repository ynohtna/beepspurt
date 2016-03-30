// import 'babel-polyfill';
const Plask = require('plask');
import createSagaMiddleware from 'redux-saga';
import createStore from './store';
import Socket from './socket';
import { oscSaga, serverSaga } from './providers/index';
import renderer from './renderers/index';

const ON_DEV = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'));
const log = ON_DEV ? (...args) => console.log(...args) // eslint-disable-line no-console
  : function noop() {};
if (ON_DEV) {
  console.log(`

    <<<<---->>>> DEVELOPMENT <<<<---->>>>

`);
} else {
  console.log(`

      --=-=-=-==-=-=-=--
    ---=  PRODUCTION  =---
      --=-=-=-==-=-=-=--

`);
}

import appSettings from './settings';
const settings = appSettings(ON_DEV);
log('Settings:', settings, '\n');

const sagaMiddleware = createSagaMiddleware();
const { store, dispatch } = createStore(sagaMiddleware);
log('Initial state:', store.getState(), '\n');

sagaMiddleware.run(oscSaga, new Socket(settings.osc));
sagaMiddleware.run(serverSaga, settings.server);

import perfnow from 'performance-now';
const fps = settings.framerate || 30;
let maxFrameTime = 0;
let lastFrame;
let lastClock;

log(`---- ---- ${perfnow()} ---- ----`);

Plask.simpleWindow({
  settings,

  init() {
    const { paint } = this;
    renderer.init(paint, settings);
    dispatch('/plask/INIT');
    dispatch('/renderer/FRAME_INIT', settings);
  },

  draw() {
    dispatch('/renderer/FRAME_ADVANCE');

    const now = perfnow();
    if (lastFrame) {
      const frameTime = now - lastFrame;
      if (frameTime > maxFrameTime) {
        maxFrameTime = frameTime;
      }
    }
    lastFrame = now;

    const { canvas, paint } = this;
    const storeState = store.getState();

    const { rendererState } = storeState;
    const { state, frame } = rendererState;

    // Every second show amortised draw timing stats.
    if ((frame % fps) === 0) {
      const mspf = lastClock ? ((now - lastClock) / fps) : 0;
      log(`#${frame} : ${now} : ${mspf} : ${maxFrameTime}`);
      lastClock = now;
      maxFrameTime = 0;
    }

    if (state === 'pause') {
      return;
    } else if (state === 'off') {
      canvas.clear(0, 0, 0, 255);
      return;
    }

    // Clear canvas.
    const { clearColour: [clrr, clrg, clrb, clra] } = rendererState;
    canvas.clear(clrr, clrg, clrb, clra);

    // Perform render.
    renderer.draw(canvas, paint, storeState);
  }
});
