import plask from 'plask';
import settings from './settings';

const state = {
  i: 0,
  msg: '[beep]'
};

plask.simpleWindow({
  settings,
  init: function init() { // eslint-disable-line object-shorthand
    const { paint } = this;
    paint.setFontFamily('Monaco', '14');
    paint.setTextSize(128);

    console.log(settings);	// eslint-disable-line no-console
  },
  draw: function draw() { // eslint-disable-line object-shorthand
    const { canvas, paint } = this;
    const b = (Math.random() * 255) | 0;
    const i = state.i;

    canvas.clear((i * 2) & 0xff, ~i, b, 0);

    if ((i >> 3) & 0x01) {
      paint.setColor(255, 255, 255, 255);
      canvas.drawText(paint, state.msg, 200, 260);
    }

    state.i = (i + 1) & 0xff;
  }
});
