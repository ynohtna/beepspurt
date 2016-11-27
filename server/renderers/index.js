/* eslint-disable no-console */
import { initMessage, drawMessage } from './message.js';
import { initPhoto, drawPhoto } from './photo.js';
// import { initVideo, drawVideo } from './videoTest.js';

// TODO: Multi-renderer support.
/*
   init() {
     rendererList = renderers.map(r => r.init(gl, canvas, paint, settings));
   }
   draw() {
     rendererList.sort();
     rendererList.forEach(r => r.draw());
   }
*/


// ---- INIT ----
const init = (gl, canvas, paint, settings) => {
  initMessage(gl, canvas, paint, settings);
  initPhoto(gl, canvas, paint, settings);
// initVideo(gl, canvas, paint, settings);
};


// ---- DRAW ----
const draw = (gl, canvas, paint, state) => {
//  drawVideo(gl, canvas, paint, state);
  drawPhoto(gl, canvas, paint, state);
  drawMessage(gl, canvas, paint, state);
};


export default {
  init,
  draw
};
