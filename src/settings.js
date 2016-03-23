const NAME = '[beep]spurt';

const settings = {
  width: 800,
  height: 600,
  center: true,
  framerate: 30,
  title: NAME,

  osc: {
    port: 6339
  },

  type: '3d2d',
  syphon_server: NAME,

  server: {
    autoStart: true,
    gzip: true,
    name: NAME,
    port: 9336,
    version: '1.0.0',

    statics: {
      index: {
        path: /^\/[^\/]*$/,
        config: {
          default: 'index.html',
          directory: './dist'
        }
      }
    }
  }
};
export default settings;
