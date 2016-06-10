/* eslint-disable no-console */
let lastFontFamily;

const drawMessage = (canvas, paint, state) => {
  const { rendererState, spurterState } = state;
  const { width, height } = rendererState;
  const { message, colour: [r, g, b, a], fontFamily } = spurterState;

  if (fontFamily !== lastFontFamily) {
    paint.setFontFamily(fontFamily, 0);
    lastFontFamily = fontFamily;
    console.log(`
===== NEW FONT ${fontFamily} =====
`);
  }

  paint.setColor(r, g, b, (a * 255) | 0);
  //      paint.setColor(255, 255, 255, 255);

  const bounds = paint.measureTextBounds(message);
  const x0 = bounds[0];
  const y0 = bounds[1];
  const x1 = bounds[2];
  const y1 = bounds[3];
  const w = x1 - x0;
  const h = y1 - y0;
//    const mx = x0 + (x1 - x0) / 2;
//    const my = y0 + (y1 - y0) / 2;
  const sx = width / w;
  const sy = height / h;
  const scale = sx < sy ? sx : sy;
//    const ox = (width / 2) - (w * sx);
//    const oy = (height / 2) - (h * sy);
  canvas.resetMatrix();
  canvas.translate(0, ((height / 2) - h) / scale);
  canvas.scale(scale, scale);
//    canvas.skew(0.5, -0.2);
//    const top = false;
//    const y = top ? 0 : (height - y1);
  canvas.drawText(paint, message, -x0, -y0);
};

export default drawMessage;
