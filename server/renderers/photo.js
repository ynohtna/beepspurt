/* eslint-disable no-console */
import chalk from 'chalk';
const Plask = require('plask');
const fs = require('fs');
const path = require('path');
const process = require('process');
const util = require('util');

let photoDir = './photos';
let photoFullname;
let photoFillmode;
let photoCanvas;
let drawCoords;

const getPhotos = dir => {
  try {
    const files = fs.readdirSync(dir);
    return files;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// ---- initPhoto ----
const initPhoto = (gl, canvas, paint, settings) => {
  const cwd = process.cwd();
  photoDir = path.join(cwd, '/photos');
  console.log(chalk.green(`:::: photoDir: ${photoDir} ::::`));

  const files = getPhotos(photoDir);
  console.log(chalk.green(util.inspect(files)));
};


// ---- calcPos ----
const calcPos = (dw, dh, sw, sh, fillmode) => {
  const xscale = dw / sw;
  const yscale = dh / sh;
  const daspect = dw / dh;
  const saspect = sw / sh;

  let w;
  let h;
  let s;
  let dxm;
  let dym;
  let sxm;
  let sym;

  // Retain aspect ratio according to a scaling mode.
  switch (fillmode) {
    case 'scale-down':
      console.error('photo: scale-down fill mode not implemented');
      // INTENTIONAL FALLTHROUGH!

    case 'contain':
      if (xscale > yscale) {
        // Source image will be height constrained.
        // Margin to be added on left/right.
        w = sw * yscale;
        dxm = (dw - w) / 2;
        drawCoords = [dxm, 0, dxm + w, dh,
                      0, 0, sw, sh];
      } else {
        // Source image will be width constrained.
        // Margin to be added on top/bottom.
        h = sh * xscale;
        dym = (dh - h) / 2;
        drawCoords = [0, dym, dw, dym + h,
                      0, 0, sw, sh];
      }
      break;

    case 'cover':
      if (yscale > xscale) {
        // Source image will be cropped left/right.
        drawCoords = [0, 0, dw, dh,
                      0, 0, sw, sh // TODO
        ];
      } else {
        // Source image will be cropped top/bottom.
        drawCoords = [0, 0, dw, dh,
                      0, 0, sw, sh // TODO
        ];
      }
      break;

    case 'fill':
      drawCoords = [0, 0, dw, dh,
                    0, 0, sw, sh];
      break;

    default: // none
      w = Math.min(dw, sw);
      h = Math.min(dh, sh);
      dxm = (dw - w) / 2;
      dym = (dh - h) / 2;
      sxm = (sw - w) / 2;
      sym = (sh - h) / 2;
      drawCoords = [dxm, dym, dxm + w, dym + h,
                    sxm, sym, sxm + w, sym + h];
      break;
  }
};


// ---- drawPhoto ----
let lastErrorFilename;

const drawPhoto = (gl, canvas, paint, state) => {
  const { rendererState, photoState } = state;
  const { filename, fillmode } = photoState;
  const { width, height
  } = rendererState;
  let recalc = false;

  if (!filename || !filename.length) {
    // No photo to show: early out.
    return;
  }

  const fullname = path.join(photoDir, filename);
  if (!fs.existsSync(fullname)) {
    if (fullname !== lastErrorFilename) {
      console.log(chalk.white.bgRed(`Missing photo: ${fullname}`));
      lastErrorFilename = fullname;
    }
    return;
  }

  if (fullname !== photoFullname) {
    // Load photo into canvas.
    photoCanvas = Plask.SkCanvas.createFromImage(fullname);
    console.log(chalk.black.bgYellow(`Photo loaded: ${fullname}`));
    photoFullname = fullname;
    recalc = true;
  }

  if (fillmode !== photoFillmode) {
    recalc = true;
  }

  if (recalc) {
    calcPos(width, height, photoCanvas.width, photoCanvas.height, fillmode);
    photoFillmode = fillmode;
  }

  const [dx, dy, dw, dh,
         sx, sy, sw, sh] = drawCoords;
  canvas.drawCanvas(paint, photoCanvas,
                    dx, dy, dw, dh,
                    sx, sy, sw, sh);
};

export {
  initPhoto,
  drawPhoto
};
