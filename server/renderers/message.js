/* eslint-disable no-console */
import chalk from 'chalk';
const initMessage = (gl, canvas, paint, settings) => {
  paint.setFontFamily('Rockwell', 0);
  paint.setTextSize(128);
  paint.setFakeBoldText(true);
  paint.setAntiAlias(true);
  paint.setSubpixelText(true);
  paint.setLCDRenderText(true);
  paint.setAutohinted(true);
};

let lastFontFamily;
let lastBold;
let lastItalic;

const drawMessage = (gl, canvas, paint, state) => {
  const { rendererState, spurterState } = state;
  const { width, height } = rendererState;
  const { message,
          colour: [r, g, b, a],
          fontFamily,
          bold,
          italic
  } = spurterState;

  const fontFlag = (bold ? 1 : 0) + (italic ? 2 : 0);

  if (fontFamily !== lastFontFamily) {
    paint.setFontFamily(fontFamily, fontFlag);
    lastFontFamily = fontFamily;
    console.log(chalk.bgGreen.black(`===== NEW FONT: ${fontFamily} ${bold} ${italic} =====`));
    // Clear render cache.
  } else if (bold !== lastBold || italic !== lastItalic) {
    paint.setFontFamily(fontFamily, fontFlag);
    lastBold = bold;
    lastItalic = italic;
    console.log(chalk.bgMagenta.black(`---- NEW BOLD/ITALIC: ${bold} ${italic} ----`));
    // Clear render cache.
  }

  paint.setColor(r, g, b, a | 0);

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

export {
  initMessage,
  drawMessage
};
