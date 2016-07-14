/* eslint-disable no-console */
import chalk from 'chalk';
const util = require('util');
const Plask = require('plask');

// ---- INIT ----
const initMessage = (gl, canvas, paint /* , settings */) => {
  paint.setFontFamily('Rockwell', 0);
  paint.setTextSize(600);
  paint.setFakeBoldText(true);
  paint.setAntiAlias(true);
  paint.setSubpixelText(true);
  paint.setLCDRenderText(true);
  paint.setAutohinted(true);
};


// ---- SUBCANVAS CACHE ----
let subcanvasCache = [];

const getMakeSubcanvas = (reqw, reqh, frame, line) => {
//  console.log(`   searching subcanvasCache: ${subcanvasCache.length}`);
  const index = subcanvasCache.findIndex(canvas => (reqw <= canvas.w) && (reqh <= canvas.h));

  let canvas;
  if (index === -1) {
    // Make and return new subcanvas.
    // Round up dimensions to a power of two or similar nonsense.
    const upw = (1 + Math.floor(reqw / 128)) * 128;
    const uph = (1 + Math.floor(reqh / 128)) * 128;
    canvas = {
      w: upw,
      h: uph,
      reqw,
      reqh,
      frame,
      line,
      canvas: Plask.SkCanvas.create(upw, uph)
    };
    console.log(`NEW CANVAS: ${reqw} x ${reqh} => ${upw} x ${uph}`);
  } else {
    // Use this subcanvas, remove it from cache.
    const sub = subcanvasCache[index];
    canvas = {
      ...sub,
      reqw,
      reqh,
      frame,
      line
    };
    console.log(`OLD CANVAS ${index}: ${reqw} x ${reqh} => ${canvas.w} x ${canvas.h}`);
    subcanvasCache.splice(index, 1);
    /*
       subcanvasCache = [
       ...subcanvasCache.slice(0, index),
       ...subcanvasCache.slice(index + 1)
       ];
     */
  }
//  console.log(`      now subcanvasCache: ${subcanvasCache.length}`);
  return canvas;
};

const cullCache = frame => {
  const subLifetime = 10 * 60; // Ten seconds at 60 FPS.
  const preSize = subcanvasCache.length;
  subcanvasCache = subcanvasCache.filter(sub => (frame - sub.frame) < subLifetime);
  const postSize = subcanvasCache.length;

  if (postSize !== preSize) {
    const culled = preSize - postSize;
    console.log('  ', chalk.magenta(`${culled} canvases culled`));
  }
};


// ---- RENDERING ----
let boundsW = 0;
let boundsH = 0;
let canvases = [];

let lines;
let emHeight;

const renderLines = (paint, frame, lineSpacing) => {
  // Reset overall bounds.
  boundsW = boundsH = 0;
  canvases = [];

  // FIXME: boundsH can be recalculated without needing to render.
  // Calculate it pro-actively as part of the on-screen blit process.
  const yAdvance = emHeight * lineSpacing;

  // For each line of text:
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];

    // Measure bounds.
    const bounds = paint.measureTextBounds(line);
    const x0 = bounds[0];
    const y0 = bounds[1];
    const x1 = bounds[2];
    const y1 = bounds[3];
    const w = x1 - x0;
    const h = y1 - y0;

    // Update overall bounds.
    if (w > boundsW) {
      boundsW = w;
    }

    boundsH += yAdvance;

    // Make subcanvas of appropriate size.
    const subcanvas = getMakeSubcanvas(w, h, frame, line);
    const { canvas } = subcanvas;

    // Clear it.
    canvas.clear(0, 0, 0, 0);

    // Render the line of text into the subcanvas.
    canvas.drawText(paint, line, -x0, -y0);

    canvases.push(subcanvas);
  }
};

let lastMessage;
let lastFontFamily;
let lastBold;
let lastItalic;
let lastColour;

const checkRender = (paint, message, fontFamily, bold, italic) => {
  let render = false;

  if (fontFamily !== lastFontFamily || bold !== lastBold || italic !== lastItalic) {
    lastFontFamily = fontFamily;
    lastBold = bold;
    lastItalic = italic;
    render = true;

    const fontFlag = (bold ? 1 : 0) + (italic ? 2 : 0);
    paint.setFontFamily(fontFamily, fontFlag);

    const embounds = paint.measureTextBounds('m');
    emHeight = embounds[3] - embounds[1];

    console.log(chalk.bgBlue.white(`= FONT ${fontFamily} b:${bold} i:${italic} em:${emHeight}`));
  }

  if (message !== lastMessage) {
    lastMessage = message;
    render = true;

    lines = message.split('\n');
    while (lines.length && lines[0] === '') {
      lines.shift();
    }
    while (lines.length && lines[lines.length - 1] === '') {
      lines.pop();
    }
    console.log(chalk.bgRed.white(util.inspect(lines)));
  }

  return render;
};


// ---- DRAW ---
const drawMessage = (gl, canvas, paint, state) => {
  const { rendererState, spurterState } = state;
  const { width, height,
          frame,
          foreground, background,
          invert
  } = rendererState;
  const { message,
          fontFamily,
          bold,
          italic,
          halign,
          valign
  } = spurterState;
  const lineSpacing = 1.5;

  let render = checkRender(paint, message, fontFamily, bold, italic);

  const colour = invert ? background : foreground;
  if (colour !== lastColour) {
    console.log(chalk.bgMagenta.white(`---- NEW COLOUR: ${colour} ----`));
    lastColour = colour;
    render = true;
  }

  const [r, g, b, a] = colour;
  paint.setColor(r, g, b, a | 0);

  if (render) {
    if ((frame & 0xff) === 0xff) {
      cullCache();
    }

    // Add existing canvases back into cache.
    subcanvasCache = [...subcanvasCache, ...canvases];
    canvases = [];

    console.log(chalk.bgRed.white('* RENDER *'));
    renderLines(paint, frame, lineSpacing);
  }

  // With overall bounds (TODO: expose margin percentage):
  //   Calculate scaling to fit output width & height.
  const margin = width * 0.2;
  const scalew = (width - margin) / boundsW;
  const scaleh = (height - margin) / boundsH;
  const scalea = Math.min(scalew, scaleh);

  if (render) {
    console.log(`Scale: ${scalea} for ${boundsW} x ${boundsH} (margin: ${margin / 2}px)`);
    // For each cached:
    for (let j = 0; j < subcanvasCache.length; ++j) {
      const sub = subcanvasCache[j];
      console.log(`  sub ${j}/${sub.frame}: ${sub.w},${sub.h} for `
                + `${sub.reqw},${sub.reqh}: ${sub.line}`);
    }
  }

  const lx = margin * 0.5;
  const ty = margin * 0.5;
  const by = height - (boundsH + ty);
  const cy = (height - boundsH) * 0.5;
  let y = (valign <= 0 ? ty :	// eslint-disable-line no-nested-ternary
             (valign >= 2 ? by : cy));

  const yAdvance = emHeight * lineSpacing * scalea;

  // For each canvas:
  for (let i = 0; i < canvases.length; ++i) {
    const cvs = canvases[i];
    if (render) {
      console.log(`${i}/${cvs.frame}: ${cvs.w},${cvs.h} for ${cvs.reqw},${cvs.reqh}: ${cvs.line}`);
      cvs.canvas.writeImage('png', `/Users/anthony/src/beepspurt/server/cvs_${i}.png`);
    }

    // Blit to output with appropriate scaling and alignment.
    // TODO: horizontal & vertical alignment.
    const dx = (cvs.reqw * scalea);
    const dy = (cvs.reqh * scalea);
    const rx = (width - dx) - lx;
    const cx = (width - dx) * 0.5;
    const x = (halign <= 0 ? lx :  // eslint-disable-line no-nested-ternary
                (halign >= 2 ? rx : cx));
    canvas.drawCanvas(paint, cvs.canvas,
                      x, y, x + dx, y + dy,
                      0, 0, cvs.reqw, cvs.reqh);

    y += yAdvance;
  }

  // TODO: Strip/collate cache if its too large. Use a LRU marker?
};


export {
  initMessage,
  drawMessage
};
