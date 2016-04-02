/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
import restify from 'restify';
import restifyPlugins from 'restify-plugins';
import { Watershed } from 'watershed';
import { createHash } from 'crypto';

import { effects, isCancelError } from 'redux-saga';
const { call, cancel, fork, race, put, select, take } = effects;
import { cancellablePromise } from '../utils';
import selectors from './selectors';

// Server notifications.
const SERVER_STARTED = '/server/STARTED';
const SERVER_STOPPED = '/server/STOPPED';
const CLIENT_CONNECTED = '/client/CONNECTED';
const CLIENT_UPGRADED = '/client/UPGRADED';
const SERVER_ERROR = '/server/ERROR';

// Server manipulation requests.
const START_SERVER = '/server/START';
const STOP_SERVER = '/server/STOP';
const SERVER_SEND = '/server/SEND';
const UPDATE_CLIENTS = '/server/UPDATE_CLIENTS';

const toJS = obj => JSON.stringify(obj);

const dontLog = {
  '/renderer/STATE': true,
  '/ping': true,
  '/pong': true
};

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
  server._wsc = {};
  server.on('opened', () => {
    console.log('server/opened');
    resolve('opened');
  });
  server.on('connect', (request /* , socket, head */) => {
    console.log('server/connect', request);
    resolve('connect');
  });
  server.on('upgrade', (request, socket, head) => {
    console.log('**** socket:upgrade', request.headers.origin,
                request.headers['sec-websocket-key']);
    let wsc;
    let id;
    try {
      wsc = shed.accept(request, socket, head);
      const hash = createHash('sha256');
      hash.update(`${request.headers.origin}`);
      hash.update(`${request.headers['sec-websocket-key']}`);
      hash.update(`${wsc._remote}`);
      const rand = (Math.random() * 0xffffffff) | 0;
      hash.update(`${rand}`);
      id = hash.digest('hex');
    } catch (ex) {
      console.error('**** socket:error', ex);
      socket.end();
      return resolve(ex);
    }
    wsc.on('text', text => {
      let action = `badmsg: ${text}`;
      try {
        action = JSON.parse(text);
        if (!(action.addr in dontLog)) {
          console.log('>>>> socket:text', text, action);
        }
      } catch (ex) {
        console.error('>>>> ---- >>>> socket:text', text);
        console.error(text, ex);
      }
      resolve(action);
    });
    wsc.on('end', (code, reason) => {
      console.log('---- socket:end [code, reason, remote]', code, reason, wsc._remote);
      server._wsc[id] = null;
    });
    if (id) {
      wsc.send(JSON.stringify({ addr: '*HIHO*', id }));
      server._wsc[id] = wsc;
      console.log('++ :: %%', id, wsc._remote);
    }
    return resolve('upgraded');
  });
  server.on('clientError', (ex, socket) => {
    console.log('**** clientError', ex, socket);
    resolve('clienterror');
  });
  server.on('close', () => {
    console.log('---- server/closed');
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

const mungeArgs = args => ((args.length === 1) ? args[0] : args);
const dispatchHandler = ({ addr, id, args }) => ({ type: addr,
                                                   id,
                                                   payload: mungeArgs(args) });

const handlers = {
  '/renderer/STATE': dispatchHandler,
  '/spurter/MERGE': dispatchHandler,
  '/spurter/MESSAGE': dispatchHandler,
  '/spurter/FONT_FAMILY': dispatchHandler,
  '/spurter/COLOUR': dispatchHandler,
  '/ping': ({ args, id }) => ({ type: SERVER_SEND, addr: '/pong', args, id }),
  // ---- internal notifications ----
  opened: { type: SERVER_STARTED },
  closed: { type: SERVER_STOPPED },
  connected: { type: CLIENT_CONNECTED },
  upgraded: { type: CLIENT_UPGRADED }
};

function* serveRequests(source) {
  try {
    console.log('* serveRequests');

    let req = yield call(source.nextRequest);
    while (req) {
      let action;
      if (!req.addr || !(req.addr in dontLog)) {
        console.log('**** request', req);
      }
      if (req.addr && req.addr in handlers) {
        action = handlers[req.addr](req);
//        console.log('.... handled action:=', action);
      } else if ((typeof req === 'string') && (req in handlers)) {
        action = handlers[req];
      } else {
        console.error('^^^^^ UNHANDLED SERVER REQUEST !!!!!\n');
      }
      if (action) {
//        console.log('>>>>', action);
        yield put(action);
      } else {
        console.log('^^^^ NO ACTION ^^^^\n');
      }
      req = yield call(source.nextRequest);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('* serveRequests error', error);
    }
  }
}

function* sendMessage(server, msg) {
  const { addr, id, args } = msg;
  if (id) {
    const wsc = (id in server._wsc) && server._wsc[id];
    if (wsc) {
      const packet = JSON.stringify({ addr, args });
      wsc.send(packet);
      if (!(addr in dontLog)) {
        console.log('--->', packet);
      }
    } else {
      console.error('!!!! SERVER_SEND request on DEAD CHANNEL', id, server._wsc);
    }
  } else if (server._wsc) {
//    console.log(' :: --==>', server._wsc);
    const packet = JSON.stringify({ addr, args });
    for (const i in server._wsc) {
//      console.log(' :: --==>', i);
      if (!server._wsc.hasOwnProperty(i)) {
        continue;
      }
      const client = server._wsc[i];
      if (client) {
        console.log('[-=>', packet, i);
        client.send(packet);
      }
    }
  }
}

let memos = [];
function* updateSelector({ selector, memo, action }, i) {
  const state = yield select(selector);
  const lastMemo = memos[i];
  const newMemo = memo && memo(state);
//  console.log('up', state, lastMemo, newMemo);
  if (lastMemo !== newMemo) {
    const act = action(state);
//    console.log('\n~~~ selector update ~~~\n', state, act);
    if (act) {
      yield put(act);
    }
    memos[i] = newMemo;
  }
}

function* sendMessages(server) {
  try {
    yield take(SERVER_STARTED);
    const send = true;
    while (send) {
      const msg = yield race({
        send: take(SERVER_SEND),
        update: take(UPDATE_CLIENTS),
        upgraded: take(CLIENT_UPGRADED)
      });
      if (msg.send) {
        yield fork(sendMessage, server, msg.send);
      } else if (msg.update) {
        // Update clients with pieces of state as required.
        for (let i = 0; i < selectors.length; ++i) {
          yield fork(updateSelector, selectors[i], i);
        }
      } else if (msg.upgraded) {
        // Clear out all memos so all clients get updates.
        console.log(`
- UPGRADED - MEMO CLEAR -
        `);
        memos = [];
      } else {
        console.error(' how we got here?!!! ', msg);
      }
    }
  } catch (error) {
    if (!isCancelError(error)) {
      console.error('*sendMessages error', error);
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

  // Server always tries to start up.
  const awaitStart = false;

  const active = true;
  while (active) {
    if (awaitStart) { // Await user-initiated start server request.
      yield take(START_SERVER);
      console.log(START_SERVER);
    }

    // Fork server request handling.
    const requestsTask = yield fork(serveRequests, source);

    // Start server listening.
    console.log('socket/opening...');
    const hostname = config.hostname || '127.0.0.1';
    const port = config.port || 9336;
    if ((hostname === '127.0.0.1') || (hostname === 'localhost')) {
      console.warn(`
---- **** SERVER LISTENING on LOCALHOST ONLY **** ${hostname} ----
`);
    } else if (hostname === '0.0.0.0') {
      console.warn(`
---- **** SERVER LISTENING on ALL INTERFACES **** ----
`);
    }
    server.listen(port, hostname, () =>
      server.emit('opened')
    );

    // Fork server sending.
    const sendTask = yield fork(sendMessages, server);

    // Race: didStop, stop, error, start.
    const winner = yield race({
      didStop: take(SERVER_STOPPED),
      erred: take(SERVER_ERROR),
      stop: take(STOP_SERVER),
      start: take(START_SERVER)
    });
    console.log('***** serveSaga race!', winner,
                requestsTask.isRunning(), sendTask.isRunning());

    // Cancel fetch & send tasks.
    console.log('cancelling server request handling');
    yield cancel(requestsTask);

    console.log('cancelling server sending');
    yield cancel(sendTask);

    // TODO: Dispatch socket status as per the race winner.

    // Stop server if didClose didn't win race.
    if (!winner.didStop) {
      server.close();
    }
  }
}
export default serverSaga;
