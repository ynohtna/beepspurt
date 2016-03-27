const name = '[beep]spurt';
const port = 9336;
const version = '1.0.0';

const server = {
  name,
  port,
  version,
  autoStart: true,
  gzip: false,

  statics: {
    index: {
      path: /^\/[^\/]*$/,
      config: {
        default: 'index.html',
        directory: './dist'
      }
    }
  }
};

const settings = {
  width: 800,
  height: 600,
  center: true,
  framerate: 30,
  title: name,

  osc: {
    port: 6339
  },

  type: '3d2d',
  syphon_server: name,

  server
};
export default settings;
