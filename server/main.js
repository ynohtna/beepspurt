// import 'babel-polyfill';
const Plask = require('plask');
import createSagaMiddleware from 'redux-saga';
import settings from './settings';
import createStore from './store';
import Socket from './socket';
import { oscSaga, serverSaga } from './providers/index';
import renderer from './renderers/index';

const log = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'))
  ? (...args) => console.log(...args) // eslint-disable-line no-console
  : function noop() {};

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
    canvas.clear(clrr, clrg, clrb, (clra * 255) | 0);

    // Perform render.
    renderer.draw(canvas, paint, storeState);
  }
  /*
  draw() {
    const { rendererState, spurterState } = store.getState();

    const { clearColour: [clrr, clrg, clrb, clra], frame } = renderer;
    const { message, colour: [r, g, b, a] } = spurter;

    canvas.clear(clrr, clrg, clrb, (clra * 255) | 0);

    if ((frame >> 3) & 0x01) {
      paint.setColor(r, g, b, (a * 255) | 0);
      //      paint.setColor(255, 255, 255, 255);
      const bounds = paint.measureTextBounds(message);
      const x0 = bounds[0];
      const y0 = bounds[1];
      const x1 = bounds[2];
      const y1 = bounds[3];
      const w = x1 - x0;
      const h = y1 - y0;
      const mx = x0 + (x1 - x0) / 2;
      const my = y0 + (y1 - y0) / 2;
      const sx = renderer.width / w;
      const sy = renderer.height / h;
      const scale = sx < sy ? sx : sy;
      const ox = (renderer.width / 2) - (w * sx);
      const oy = (renderer.height / 2) - (h * sy);
      canvas.resetMatrix();
      canvas.translate(0, ((renderer.height / 2) - h) / scale);
      canvas.scale(scale, scale);
//      canvas.skew(0.5, -0.2);
      const top = false;
      const y = top ? 0 : (renderer.height - y1);
      canvas.drawText(paint, message, -x0, -y0);

      if ((frame % 600) === 0x0) {
        console.log(`
   -- ++ bounds: ${bounds} ++ scale: ${scale} (${sx}, ${sy})
`);
      }
    }

    const now = perfnow();
    if (lastFrame) {
      const frameTime = now - lastFrame;
      if (frameTime > maxFrameTime) {
        maxFrameTime = frameTime;
      }
    }
    lastFrame = now;

    if ((frame % fps) === 0) {
      const mspf = lastClock ? ((now - lastClock) / fps) : 0;
      log(`#${frame} : ${now} : ${mspf} : ${maxFrameTime}`);
      lastClock = now;
      maxFrameTime = 0;
    }
  }
  */
});
