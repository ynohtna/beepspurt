const name = '[beep]spurt';
const port = 9336;
const hostname = '0.0.0.0';
const version = '1.0.0';

const appServer = onDevelopment => ({
  name,
  port,
  hostname,
  version,
  autoStart: true,
  gzip: false,

  statics: {
    index: {
      path: /^\/[^\/]*$/,
      config: {
        default: onDevelopment ? 'index.html' : 'index.min.html',
        directory: './dist',
        maxAge: onDevelopment ? 0 : (60 * 60)
      }
    }
  }
});

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
  syphon_server: name
};

const appSettings = onDevelopment => ({
  ...settings,
  server: {
    ...appServer(onDevelopment)
  }
});

export default appSettings;
