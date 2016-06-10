const Plask = require('plask');
import createSagaMiddleware from 'redux-saga';
import createStore from './store';
import Socket from './socket';
import { oscSaga, serverSaga } from './providers/index';
import renderer from './renderers/index';

const ON_DEV = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'));
const log = ON_DEV ? (...args) => console.log(...args) // eslint-disable-line no-console
  : function noop() {};

let bootMsg = `

      --=-=-=-==-=-=-=--
    ---=  PRODUCTION  =---
      --=-=-=-==-=-=-=--

`;
if (ON_DEV) {
  bootMsg = `

    <<<<---->>>> DEVELOPMENT <<<<---->>>>

`;
}
console.log(bootMsg); // eslint-disable-line no-console

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
const reportInterval = 5;
const reportFrames = fps * reportInterval;
let realFrame = 0;
let maxFrameTime = 0;
let lastState;
let lastFrame;
let lastClock;

log(`---- ---- ${perfnow()} ---- ----`);

Plask.simpleWindow({
  settings,

  init() {
//    this.setTitle('-- test --');
    const { paint } = this;
    renderer.init(paint, settings);
    dispatch('/plask/INIT');
    dispatch('/renderer/FRAME_INIT', settings);
  },

  draw() {
    const { canvas, paint } = this;
    const storeState = store.getState();
    const { rendererState } = storeState;
    const { state, frame } = rendererState;

    if (state !== 'pause') {
      dispatch('/renderer/FRAME_ADVANCE');
    }
    dispatch('/server/UPDATE_CLIENTS');

    const now = perfnow();
    if (lastFrame) {
      const frameTime = now - lastFrame;
      if (frameTime > maxFrameTime) {
        maxFrameTime = frameTime;
      }
    }
    lastFrame = now;


    // Every expected second show amortised draw timing stats.
    if ((realFrame % reportFrames) === 0) {
      const mspf = lastClock ? ((now - lastClock) / reportFrames) : 0;
      log(`#${realFrame}/${frame}: ${state} : ${now} : ${mspf} : ${maxFrameTime}`);
      lastClock = now;
      maxFrameTime = 0;
    }
    realFrame += 1;

    if (state === 'pause') {
      // No need to do any clearing or rendering.
    } else if (state === 'off') {
      if (lastState !== 'off') {
        canvas.clear(0, 0, 0, 0);	// Only clear once.
      }
    } else {
      // Clear canvas.
      const { clearColour: [clrr, clrg, clrb, clra] } = rendererState;
      canvas.clear(clrr, clrg, clrb, clra);

      // Perform render.
      renderer.draw(canvas, paint, storeState);
    }
    lastState = state;
  }
});
