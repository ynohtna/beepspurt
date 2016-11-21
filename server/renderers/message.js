/* eslint-disable no-console */
import chalk from 'chalk';
const util = require('util');
const Plask = require('plask');

// ---- INIT ----
const initMessage = (gl, canvas, paint /* , settings */) => {
  paint.setFontFamily('Rockwell', 0);
  paint.setTextSize(320);
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
let canvases = [];
let lines;

const renderLines = (paint, frame) => {
  // Reset overall bounds.
  canvases = [];

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

    // Make subcanvas of appropriate size.
    const subcanvas = getMakeSubcanvas(w, h, frame, line);
    const { canvas } = subcanvas;

    // Clear subcanvas to transparent.
    canvas.clear(0, 0, 0, 0);

    // Render line of text into subcanvas.
    canvas.drawText(paint, line, -x0, -y0);

    canvases.push(subcanvas);
  }
};

let lastMessage;
let lastFontFamily;
let lastBold;
let lastItalic;
let lastColour;
let emHeight = 10;
let emWidth = 10;

const checkRerender = (paint, message, fontFamily, bold, italic) => {
  let render = false;

  if (fontFamily !== lastFontFamily || bold !== lastBold || italic !== lastItalic) {
    lastFontFamily = fontFamily;
    lastBold = bold;
    lastItalic = italic;
    render = true;

    const fontFlag = (bold ? 1 : 0) + (italic ? 2 : 0);
    paint.setFontFamily(fontFamily, fontFlag);

    const embounds = paint.measureTextBounds('m');
    emWidth = embounds[2] - embounds[0];
    emHeight = embounds[3] - embounds[1];

    console.log(chalk.bgBlue.white(`= FONT ${fontFamily} b:${bold} i:${italic}, `
                                 + `emHeight:${emHeight} emWidth: ${emWidth}`));
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
          zoomScale,
          marginVH,
          lineSpacing,
          halign,
          valign,
          backgroundMode,
          backgroundOffsetRatio,
          debug
  } = spurterState;

  let rerender = checkRerender(paint, message, fontFamily, bold, italic);

  const fgColour = invert ? background : foreground;
  const bgColour = invert ? foreground : background;
  if (fgColour !== lastColour) {
    console.log(chalk.bgMagenta.white(`---- NEW COLOUR: ${fgColour} ----`));
    lastColour = fgColour;
    rerender = true;
  }

  const [fgR, fgG, fgB, fgA] = fgColour;
  const [bgR, bgG, bgB, bgA] = bgColour;

  if (rerender) {
    if ((frame & 0xff) === 0xff) {
      cullCache();
    }

    // Add existing canvases back into cache for reuse this frame.
    subcanvasCache = [...subcanvasCache, ...canvases];
    canvases = [];

    console.log(chalk.bgRed.white('* RENDER *'));

    paint.setColor(fgR, fgG, fgB, fgA | 0);

    renderLines(paint, frame);
  }

  // Calculate overall bounding box of text in src canvas units.
  const dstMargin = marginVH * height;
  const srcLineSpacing = lineSpacing * emHeight;

  const srcW = canvases.reduce((prev, cvs) => Math.max(prev, cvs.reqw),
                                  0);
  const srcH = canvases.reduce((prev, cvs) => prev + Math.max(cvs.reqh, emHeight) + srcLineSpacing,
                                  0);

  // Calculate scaling to fit text within margins.
  const dstBoxW = width - (dstMargin * 2);
  const dstBoxH = height - (dstMargin * 2);
  const zoomW = dstBoxW / srcW;
  const zoomH = dstBoxH / srcH;
  const zoomA = Math.min(zoomW, zoomH) * (zoomScale / 100);

  const dstW = srcW * zoomA;
  const dstH = srcH * zoomA;
  const dstLineSpacing = srcLineSpacing * zoomA;

  if (rerender) {
    console.log(`src bounds: ${srcW} x ${srcH}`);
    console.log(`dst bounds: ${dstW} x ${dstH}, (${zoomW}, ${zoomH}), margin: ${dstMargin}`);
    console.log((zoomA === zoomW) ? 'WIDTH CONSTRAINED' : 'HEIGHT CONSTRAINED');
  }

  canvas.resetMatrix();

  let hOffset = 0;	  // left
  if (halign === 1) { // centre
    hOffset = (dstBoxW - dstW) * 0.5;
  } else if (halign === 2) { // right
    hOffset = dstBoxW - dstW;
  }

  let vOffset = 0;    // top
  if (valign === 1) { // middle
    vOffset = (dstBoxH - dstH) * 0.5;
  } else if (valign === 2) { // bottom
    vOffset = dstBoxH - dstH;
  }

  const dstx0 = dstMargin + hOffset;
  const dsty0 = dstMargin + vOffset;
  const dstx1 = dstx0 + dstW;
  const dsty1 = dsty0 + dstH;

  if (debug) {	// Overall boundary outline.
    paint.setStroke();
    paint.setColor(255, 255, 255, 127);
    canvas.drawRect(paint, dstx0, dsty0, dstx1, dsty1);
  }

  let y0 = dsty0;
  const coords = canvases.reduce((prev, cvs, idx) => {
    const { reqw, reqh } = cvs;
    const w = reqw * zoomA;
    const h = reqh * zoomA;
    const lh = Math.max(h, emHeight * zoomA);
    let x0;
    if (halign === 0) { // left
      x0 = dstx0;
    } else if (halign === 2) { // right
      x0 = dstx1 - w;
    } else { // centre
      x0 = dstx0 + (dstW * 0.5) - (w * 0.5);
    }
    y0 += (dstLineSpacing * 0.5);// + (lh - h);
    const ords = {
      idx,
      x0,
      y0,
      x1: x0 + w,
      y1: y0 + h
    };
    y0 += lh + (dstLineSpacing * 0.5);
    return [...prev, ords];
  }, []);

  if (rerender) {
    console.log(`~~ coords: ${util.inspect(coords)}`);
  }

  if (backgroundMode > 0) {	// Tape background.
    const ofs = dstLineSpacing * backgroundOffsetRatio;
    paint.setFill();
    paint.setColor(bgR, bgG, bgB, bgA | 128);
    coords.forEach(coord => {
      canvas.drawRect(paint, coord.x0 - ofs, coord.y0 - ofs, coord.x1 + ofs, coord.y1 + ofs);
    });
  }

  if (debug) {	// Outline each line of text.
    paint.setStroke();
    paint.setColor(255, 255, 255, 127);
    coords.forEach(coord => {
      canvas.drawRect(paint,
                      coord.x0, coord.y0,
                      coord.x1, coord.y1);
    });
  }

  paint.setFill();
  paint.setColor(255, 255, 255, 255);
  coords.forEach((coord, idx) => {	// Draw each line of text.
    const cvs = canvases[idx];
    canvas.drawCanvas(paint, cvs.canvas,
                      coord.x0, coord.y0,
                      coord.x1, coord.y1,
                      0, 0,
                      cvs.reqw, cvs.reqh);
  });
};


export {
  initMessage,
  drawMessage
};
