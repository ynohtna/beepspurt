import 'babel-polyfill';
import Plask from 'plask';
import settings from './settings';
import createStore from './store';
import createSagaMiddleware from 'redux-saga';
import oscSaga from './providers/oscSaga';
import Socket from './socket';

const log = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'))
  ? (...args) => console.log(...args) // eslint-disable-line no-console
  : function noop() {};

log('Settings:', settings);

const sagaMiddleware = createSagaMiddleware();
const { store, dispatch } = createStore(sagaMiddleware);
log('Initial state:', store.getState());

sagaMiddleware.run(oscSaga, new Socket(settings.osc));

const perfnow = require('performance-now');
const fps = settings.framerate || 30;
let maxFrameTime = 0;
let lastFrame;
let lastClock;

log(`---- ---- ${perfnow()} ---- ----`);

Plask.simpleWindow({
  settings,

  init() {
    const { paint } = this;
    paint.setFontFamily('Monaco', '14');
    paint.setTextSize(128);

    dispatch('/plask/INIT');
  },

  draw() {
    dispatch('/renderer/FRAME_ADVANCE');

    const { canvas, paint } = this;

    const { renderer, vars } = store.getState();

    const { clearColour: [r, g, b, a], frame } = renderer;
    const { message } = vars;

    canvas.clear(r, g, b, a);

    if ((frame >> 3) & 0x01) {
      paint.setColor(255, 255, 255, 255);
      canvas.drawText(paint, message, 200, 260);
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
