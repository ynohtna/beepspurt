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
  gzip: true,

  statics: {
    index: {
      path: /^\/[^\/]*$/,
      config: {
        default: onDevelopment ? 'index.html' : 'index.min.html',
        directory: './dist',
        maxAge: onDevelopment ? 0 : (60 * 60)
      }
    },
    fonts: {
      path: /^\/fonts\/.*$/,
      config: {
        directory: './dist',
        maxAge: onDevelopment ? (15 * 60) : (24 * 60 * 60)	// 15 minutes : 24 hours.
      }
    }
  }
});

const settings = {
  width: 800,
  height: 600,
  position: { x: 400, y: 1200 },
//  center: true,
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
