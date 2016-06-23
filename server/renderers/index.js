/* eslint-disable no-console */
import { initMessage, drawMessage } from './message.js';

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

const init = (gl, canvas, paint, settings) => {
  initMessage(gl, canvas, paint, settings);
// initVideo(gl, canvas, paint, settings);
};

const draw = (gl, canvas, paint, state) => {
  const { rendererState } = state;
  const { frame } = rendererState;

//  drawVideo(gl, canvas, paint, state);

  if ((frame) & 0x01) {
    drawMessage(gl, canvas, paint, state);
  }
};

export default {
  init,
  draw
};
