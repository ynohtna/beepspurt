/* eslint-disable no-console */

// ---- ---- WORD SPURTER ---- ----

// TODO: Refactor into list of declared renderers, each with chosen/active states.
// Call init on each, then draw on chosen & active.
const init = (paint, settings) => {
  paint.setFontFamily('Rockwell', 0);
  paint.setTextSize(128);
  paint.setFakeBoldText(true);
  paint.setAntiAlias(true);
  paint.setSubpixelText(true);
  paint.setLCDRenderText(true);
  paint.setAutohinted(true);
};

let lastFontFamily;

const draw = (canvas, paint, state) => {
  const { rendererState, spurterState } = state;
  const { message, colour: [r, g, b, a], fontFamily } = spurterState;
  const { frame } = rendererState;

  if (fontFamily !== lastFontFamily) {
    paint.setFontFamily(fontFamily, 0);
    lastFontFamily = fontFamily;
    console.log(`

===== NEW FONT ${fontFamily} =====

`);
  }

  if ((frame) & 0x01) {
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
    const sx = rendererState.width / w;
    const sy = rendererState.height / h;
    const scale = sx < sy ? sx : sy;
    const ox = (rendererState.width / 2) - (w * sx);
    const oy = (rendererState.height / 2) - (h * sy);
    canvas.resetMatrix();
    canvas.translate(0, ((rendererState.height / 2) - h) / scale);
    canvas.scale(scale, scale);
    //      canvas.skew(0.5, -0.2);
    const top = false;
    const y = top ? 0 : (rendererState.height - y1);
    canvas.drawText(paint, message, -x0, -y0);

    if ((frame % 600) === 10) {
      console.log(`
-- ++ bounds: ${bounds} ++ scale: ${scale} (${sx}, ${sy})
`);
    }
  }
};

export default {
  init,
  draw
};
