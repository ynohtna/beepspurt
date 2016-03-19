import 'babel-polyfill';
import plask from 'plask';
import settings from './settings';
import store, { dispatch } from './store';

const log = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('dev'))
  ? (...args) => console.log(...args) // eslint-disable-line no-console
  : function noop() {};

log('Settings:', settings);
log('Initial state:', store.getState());

const perfnow = require('performance-now');
const fps = settings.framerate || 30;
let lastFrame;
let maxFrame = 0;
let lastClock;

plask.simpleWindow({
  settings,

  init() {
    const { paint } = this;
    paint.setFontFamily('Monaco', '14');
    paint.setTextSize(128);

    dispatch('plask/INIT');
  },

  draw() {
    dispatch('renderer/FRAME_ADVANCE');

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
      if (frameTime > maxFrame) {
        maxFrame = frameTime;
      }
    }
    lastFrame = now;

    if ((frame % fps) === 0) {
      const mspf = lastClock ? ((now - lastClock) / fps) : 0;
      log(`#${frame} : ${now} : ${mspf} : ${maxFrame}`);
      lastClock = now;
      maxFrame = 0;
    }

    if (frame === 100) {
      dispatch('vars/SET_MESSAGE', ':beep:');
    }
  }
});
