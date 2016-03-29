/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
import restify from 'restify';
import restifyPlugins from 'restify-plugins';

import { Watershed } from 'watershed';

import { effects, isCancelError } from 'redux-saga';
const { call, cancel, fork, race, put, take } = effects;
import { cancellablePromise } from '../utils';

// Server notifications.
const SERVER_STARTED = '/server/STARTED';
const SERVER_STOPPED = '/server/STOPPED';
const CLIENT_CONNECTED = '/client/CONNECTED';
const CLIENT_UPGRADED = '/client/UPGRADED';
const SERVER_ERROR = '/server/ERROR';

// Server manipulation requests.
const START_SERVER = '/server/START';
const STOP_SERVER = '/server/STOP';

const toJS = obj => JSON.stringify(obj);

const serveApi = (req, res) => {
  console.log(`
${req.serverName}$ ${req.method} ${req.url}
    ${req.headers.host} ${req.headers['user-agent']} ${req.headers.accept}
    ${toJS(req.params)}
`);
  res.send({ ok: 'OK', request: req.url });
};

const serverSource = (server) => {
  const shed = new Watershed();
  const messageQueue = [];
  const resolveQueue = [];
  const resolve = msg => {
    if (resolveQueue.length) {
      const nextResolve = resolveQueue.shift();
      nextResolve(msg);
    } else {
      messageQueue.push(msg);
    }
  };
  server.on('opened', () => {
    console.log('server/opened');
    resolve('opened');
  });
  server.on('connect', (request /* , socket, head */) => {
    console.log('server/connect', request);
    resolve('connect');
  });
  server.on('upgrade', (request, socket, head) => {
    console.log('**** server/upgrade', request.headers.origin,
                request.headers['sec-websocket-key']);
    let wsc;
    try {
      wsc = shed.accept(request, socket, head);
    } catch (ex) {
      console.error('**** watershed error', ex);
      socket.end();
      return resolve(ex);
    }
    wsc.on('text', text =>
      console.log('>>>> watershed text', text)
    );
    wsc.on('end', () =>
      console.log('---- watershed end')
    );
    wsc.send('HELLO');

    return resolve('upgraded');
  });
  server.on('clientError', (ex, socket) => {
    console.log('**** clientError', ex, socket);
    resolve('clienterror');
  });
  server.on('close', () => {
    console.log('server/closed');
    resolve('closed');
  });

  server.get(/^\/api(\/.+)/, (request, response, next) => {
    serveApi(request, response);
    resolve('api');
    return next(false);
  });

  return {
    nextRequest: () => (messageQueue.length ?
                     cancellablePromise(Promise.resolve(messageQueue.shift()))
      : cancellablePromise(new Promise(resolver => resolveQueue.push(resolver))))
  };
};

function* serveRequests(source) {
  try {
    console.log('* serveRequests');

    let req = yield call(source.nextRequest);
    while (req) {
      console.log('**** request', req);
      if (req.type) {
        // TODO: Sanitize request.
        yield put(req);
      } else {
        // Simple string packet.
        switch (req) {
          case 'opened':
            yield put({ type: SERVER_STARTED });
            break;
          case 'closed':
            yield put({ type: SERVER_STOPPED });
            break;
          case 'connected':
            yield put({ type: CLIENT_CONNECTED });
            break;
          case 'upgraded':
            yield put({ type: CLIENT_UPGRADED });
            break;
          case 'clienterror':
            break;
          default:
            break;
        }
      }
      req = yield call(source.nextRequest);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('* serveRequests error', error);
    }
  }
}

const createServer = config => {
  console.log('* createServer', config, '\n');
  const server = restify.createServer(config);

  server.pre(restify.CORS()); // eslint-disable-line new-cap
  server.pre(restifyPlugins.pre.sanitizePath());
  server.pre(restifyPlugins.pre.userAgentConnection());

  server.use(restifyPlugins.fullResponse());
  server.use(restifyPlugins.queryParser());
  if (config.gzip) {
    server.use(restifyPlugins.gzipResponse());
  }

  const statics = config.statics;
  Object.keys(statics).forEach(key => {
    const cfg = statics[key];
    console.log('** static:', key, cfg, '\n');
    const handler = restifyPlugins.serveStatic(cfg.config);
    server.get(cfg.path, handler);
  });

  return server;
};

function* serverSaga(...args) {
  const config = args[1];

  yield take('/plask/INIT');
  console.log('* serverSaga/INIT');

  const server = createServer(config);
  const source = serverSource(server);

  let awaitStart = false; // Automatically begin listening for first loop.
  const active = true;
  while (active) {
    if (awaitStart) { // Await user-initiated start server request.
      yield take(START_SERVER);
      console.log(START_SERVER);
    }

    // Fork server handling.
    const serverTask = yield fork(serveRequests, source);

    // Open server.
    console.log('socket/opening...');
    server.listen(config.port || 9336, config.addr || '127.0.0.1', () =>
      server.emit('opened')
    );

    // TODO: Fork socket sending.

    // Race: didStop, stop, error, start.
    const winner = yield race({
      didStop: take(SERVER_STOPPED),
      erred: take(SERVER_ERROR),
      stop: take(STOP_SERVER),
      start: take(START_SERVER)
    });
    console.log('***** serveSaga race!', winner, serverTask.isRunning());

    // Cancel fetch & send.
    console.log('cancelling sever handling');
    yield cancel(serverTask);

    // TODO: Dispatch socket status as per the race winner.

    // Stop server if didClose didn't win race.
    if (!winner.didStop) {
      server.close();
    }

    // If server closed or errored then await new open request, i.e. from manual user interaction.
    awaitStart = !winner.start;
  }
}
export default serverSaga;
