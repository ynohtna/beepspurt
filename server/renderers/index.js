/* eslint-disable no-console */
import drawMessage from './drawMessage.js';

// ---- ---- WORD SPURTER ---- ----

// TODO: Refactor into list of declared renderers, each with chosen/active states.
// Call init on each, then draw on chosen & active.
const init = (paint /* , settings */) => {
  paint.setFontFamily('Rockwell', 0);
  paint.setTextSize(128);
  paint.setFakeBoldText(true);
  paint.setAntiAlias(true);
  paint.setSubpixelText(true);
  paint.setLCDRenderText(true);
  paint.setAutohinted(true);
};

const draw = (canvas, paint, state) => {
  const { rendererState } = state;
  const { frame } = rendererState;

  if ((frame) & 0x01) {
    drawMessage(canvas, paint, state);
  }
};

export default {
  init,
  draw
};
