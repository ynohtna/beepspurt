const Plask = require('plask');
import createSagaMiddleware from 'redux-saga';
import createStore from './store';
import Socket from './socket';
import { oscSaga, serverSaga } from './providers/index';
import renderer from './renderers/index';
import chalk from 'chalk';
const util = require('util');

const ON_DEV = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'));
const NO_RENDER = process.env.NO_RENDER !== undefined;
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
log(chalk.bgMagenta.white.bold(bootMsg));
if (NO_RENDER) {
  log(chalk.bgRed.white.bold(`

    [[ XX ]] RENDERING DISABLED [[ XX ]]
`));
}

import appSettings from './settings';
const settings = appSettings(ON_DEV);
log(chalk.yellow.bold('Settings: ', util.inspect(settings, { depth: 5 }), '\n'));

const sagaMiddleware = createSagaMiddleware();
const { store, dispatch } = createStore(sagaMiddleware);
log(chalk.cyan.bold('Initial state: ', util.inspect(store.getState()), '\n'));

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
    const { gl, canvas, paint } = this;
    renderer.init(gl, canvas, paint, settings);
    dispatch('/plask/INIT');
    dispatch('/renderer/FRAME_INIT', settings);
  },

  draw() {
    const { gl, canvas, paint } = this;
    const storeState = store.getState();
    const { rendererState } = storeState;
    const { state, frame, clearColour } = rendererState;

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

    if (NO_RENDER) {
      return;
    }

    // Every expected second show amortised draw timing stats.
    if ((realFrame % reportFrames) === 0) {
      const mspf = lastClock ? ((now - lastClock) / reportFrames) : 0;
      log(chalk.cyan(`#${realFrame}/${frame}: ${state} : ${now} : ${mspf} : ${maxFrameTime}`));
      lastClock = now;
      maxFrameTime = 0;
    }
    realFrame += 1;

    const [clrr, clrg, clrb, clra] = clearColour;

    if (state === 'pause') {
      // No need to do any clearing or rendering.
    } else if (state === 'off') {
      if (lastState !== 'off') {	// Only clear on first frame after being turned off.
        canvas.clear(clrr, clrg, clrb, clra);
      }
    } else {
      // Clear canvas, then render.
      canvas.clear(clrr, clrg, clrb, clra);
      renderer.draw(gl, canvas, paint, storeState);
    }

    lastState = state;
  }
});
