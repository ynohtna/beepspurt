/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
const restify = require('restify');
import { effects, isCancelError } from 'redux-saga';
const { call, cancel, fork, put, race, take } = effects;

import { cancellablePromise } from '../utils';
const Watershed = require('watershed').Watershed;

// Server notifications.
const SERVER_STARTED = '/server/STARTED';
const SERVER_STOPPED = '/server/STOPPED';
const CLIENT_UPGRADED = '/server/UPGRADED';
const SERVER_ERROR = '/server/ERROR';

// Server manipulation requests.
const SERVER_START = '/server/START';
const SERVER_STOP = '/server/STOP';

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
  const ws = new Watershed();
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
  server.on('connect', (/* request, socket, head */) => {
    console.log('server/connect');
    resolve('connect');
  });
  server.on('upgrade', (/* request, socket, head */) => {
    console.log('server/upgrade');
    // TODO: implement via Watershed.
    resolve('upgraded');
  });
  server.on('close', () => {
    console.log('server/closed');
    resolve('closed');
  });

  server.get('/websocket/attach', (request, response, next) => {
    console.log('^^^^ websocket/attach');
    if (!response.claimUpgrade) {
      return next(new Error('connection cannot upgrade'));
    }

    const upgrade = response.claimUpgrade();
    const shed = ws.accept(request, upgrade.socket, upgrade.head);
    shed.on('text', msg => console.log('>>>> websocket', msg));
    shed.send('helpme!');
    resolve('upgraded');
    return next(false);
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

const createServer = config => {
  console.log('* createServer', config);
  const server = restify.createServer(config);

  server.pre(restify.pre.sanitizePath());
  server.pre(restify.pre.userAgentConnection());

  server.use(restify.queryParser());
  if (config.gzip) {
    server.use(restify.gzipResponse());
  }

  const statics = config.statics;
  Object.keys(statics).forEach(key => {
    const cfg = statics[key];
    console.log('** static:', key, cfg);
    const handler = restify.serveStatic(cfg.directory ?
                                        { directory: cfg.directory }
                                      : cfg.config);
    server.get(cfg.path, handler);
  });

  return server;
};

function* serveRequests(source) {
  try {
    console.log('* serveRequests');

    let req = yield call(source.nextRequest);
    while (req) {
      console.log('**** request', req);
      req = yield call(source.nextRequest);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('* serveRequests error', error);
    }
  }
}

export default function* serverSaga(...args) {
  const config = args[1];

  yield take('/plask/INIT');
  console.log('* serverSaga/INIT');

  const server = createServer(config);
  const source = serverSource(server);

  let awaitStart = false; // Automatically begin listening for first loop.
  const active = true;
  while (active) {
    if (awaitStart) { // Await user-initiated start server request.
      yield take(SERVER_START);
      console.log(SERVER_START);
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
      stop: take(SERVER_STOP),
      start: take(SERVER_START)
    });
    console.log('***** serveSaga race!', winner, serverTask.isRunning());

    // Cancel fetch & send.
    console.log('cancelling sever handling');
    yield cancel(serverTask);

    // TODO: Dispatch socket status: winner.

    // Close if didClose didn't win race.
    if (!winner.didStop) {
      server.close();
    }

    // If server closed or errored then await new open request, i.e. from manual user trigger.
    awaitStart = !winner.start;
  }
}
