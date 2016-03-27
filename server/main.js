// import 'babel-polyfill';
const Plask = require('plask');
import createSagaMiddleware from 'redux-saga';
import settings from './settings';
import createStore from './store';
import Socket from './socket';
import { oscSaga, serverSaga } from './providers/index';
import draw from './draw';

const log = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'))
  ? (...args) => console.log(...args) // eslint-disable-line no-console
  : function noop() {};

log('Settings:', settings);

const sagaMiddleware = createSagaMiddleware();
const { store, dispatch } = createStore(sagaMiddleware);
log('Initial state:', store.getState());

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
    draw.init(paint, settings);
    dispatch('/plask/INIT');
    dispatch('/renderer/FRAME_INIT', settings);
  },

  draw() {
    dispatch('/renderer/FRAME_ADVANCE');

    const { canvas, paint } = this;

    const { renderer, vars } = store.getState();

    const { clearColour: [clrr, clrg, clrb, clra], frame } = renderer;
    const { message, colour: [r, g, b, a] } = vars;

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
      canvas.translate(0, 300 - (h / 2));
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
});
