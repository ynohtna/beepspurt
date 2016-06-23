/* eslint-disable no-console */
const Plask = require('plask');
const util = require('util');
import chalk from 'chalk';

let av;
let avStatus;
let mprogram;
let flip = 0;
let mesh;
let indices;

const float32Bytes = Float32Array.BYTES_PER_ELEMENT;
const makeMesh = (gl, verts) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const data = new Float32Array(verts);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return {
    buffer,
    data,
    count: data.length / 3
  };
};

const initVideo = (gl /* , canvas, paint, settings */) => {
  av = new Plask.AVPlayer(gl);
  av.setLoops(true);
  av.appendFile('/Users/anthony/maya_deren_1943.mp4');

  try {
    mprogram = Plask.gl.MagicProgram.createFromBasename(gl, __dirname, 'proto');
  } catch (e) {
    console.error(chalk.red.bold.inverse('BAD SHADER!', util.inspect(e)));
    process.exit(-1);
  }

/*
  const triangleWithUVs = makeMesh(gl, [
    // (x, y, z,), (u, v)
    0, 0, 0, 0, 0,
   -1, -1, 0, 0, 1,
    1, -1, 0, 1, 1
  ]);
  mesh = triangleWithUVs;
*/

  const squareWithUVs = makeMesh(gl, [
    // (x, y, z,), (u, v)
    1, 1, 0,  /* top right     */ 1, 1,
    1, -1, 0, /* bottom right  */ 1, 0,
    -1, -1, 0, /* bottom left   */ 0, 0,
    -1, 1, 0,  /* top left      */ 0, 1
  ]);
  mesh = squareWithUVs;

  console.log(chalk.red.dim('mesh:'), mesh);

  indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  const indexArray = new Uint16Array([
    0, 2, 1,
    3, 0, 2
  ]);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

  console.log(chalk.yellow.dim('indices:'), indexArray);
};

/*
   const maybeGlError = gl => {
   if (gl.error) {
   console.log(chalk.red.bold.inverse(gl.error));
   }
   };
 */

const drawVideo = (gl, canvas, paint, state) => {
  const { rendererState } = state;
  const { frame, width, height } = rendererState;
  let tex;

  //  gl.pushAllState();

  if (((frame) & 0x1f) === 0) {
    const status = av.status();
    if ((status === 'ready') && (av.currentDuration() > 0) && !avStatus) {
      avStatus = 'playing';
      console.log(chalk.green.bold.inverse(avStatus));
      av.setRate(0.5);
      av.play();
    }
    if (avStatus === 'playing') {
      /*
         tex = av.currentFrameTexture();
         if (tex && tex.texture) {
         vidbuf = gl.createFramebuffer();
         gl.bindFramebuffer(gl.FRAMEBUFFER, vidbuf);
         maybeGlError(gl);
         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
         gl.TEXTURE_2D, tex.texture, 0);
         maybeGlError(gl);
         const fbstatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
         console.log(chalk.magenta(fbstatus));
         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
         }
         console.log(chalk.green('av:', av.currentTime(), av.currentDuration(), av.error()));
       */
      //                  'texture:', tex);
      //      console.log(gl.isTexture(tex.texture));	// true
      /*
         av: 18.851484925 733.82 0
         texture: { target: 34037,
	     texture: WebGLTexture {},
	     flipped: true,
	     s0: 0,
	     t0: 240,
	     s1: 320,
	     t1: 240,
	     s2: 320,
	     t2: 0,
	     s3: 0,
	     t3: 0 }
	   */
    }
    flip = 128 - flip;
  }

  gl.viewport(0, 0, width, height);

  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  //  gl.depthFunc(gl.LEQUAL);
  //  gl.blendFunc(gl.ONE, gl.ONE);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendEquation(gl.FUNC_ADD);
  gl.clearDepth(1.0);
  //  gl.clearColor(flip, 100, 0, 0.5);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const mv = new Plask.Mat4();
  const t = Date.now() * 0.001;
  mv.translate(Math.sin(t) * 3,
               Math.cos(t) * 2,
              -7 + Math.sin(Date.now() * 0.007));
  mv.rotate(t, 0, 1, 0);

  const persp = new Plask.Mat4();
  persp.perspective(45, width / height, 0.1, 100.0);

  mprogram.use();
  mprogram.set_uPMatrix(persp);
  mprogram.set_uMVMatrix(mv);

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);

  // Vertices.
  gl.vertexAttribPointer(mprogram.location_aVertexPosition,
                         3, gl.FLOAT, false, 5 * float32Bytes, 0);
  gl.enableVertexAttribArray(mprogram.location_aVertexPosition);

  // UVs.
  gl.vertexAttribPointer(mprogram.location_aVertexTexCoords,
                         2, gl.FLOAT, false, 5 * float32Bytes, 3 * float32Bytes);
  gl.enableVertexAttribArray(mprogram.location_aVertexTexCoords);

  // Indices.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  //  gl.drawArrays(gl.TRIANGLE_FAN, 0, mesh.count);

  if (avStatus === 'playing') {
    tex = av.currentFrameTexture();
    const bindtex = true;
    if (tex && bindtex) {
      //    const { gl, ...rest } = mprogram;
      //    console.log(rest);
      //    process.exit(-2);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      mprogram.set_uSampler(0);
    }
  }

  gl.useProgram(null);

  //  gl.popAllState();
};

export {
  initVideo,
  drawVideo
};
