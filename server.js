/* eslint-disable no-console */
const restify = require('restify');
import config from './server.config.js';

const server = restify.createServer({
  name: config.serverName,
  version: config.apiVersion
});

server.pre(restify.pre.sanitizePath());
server.pre(restify.pre.userAgentConnection());
server.use(restify.gzipResponse());
server.use(restify.queryParser());
server.get('/', (req, res, next) => {
  console.log(`${req.serverName}$ ${req.method} ${req.url}
    ${req.headers.host} ${req.headers['user-agent']} ${req.headers.accept}
    ${req.query} | ${req.params}
`);
  console.log(req.query);
  console.log(req.params);
  res.send({ response: 'Okay, okay, okay...' });
  return next(false);
});

server.get(/\/?.*/, restify.serveStatic({
  default: 'index.html',
  directory: './dist'
}));

server.get(/\/js|css|img\/?.*/, restify.serveStatic({
  directory: './server/static'
}));

server.listen(process.env.SERVER_PORT || config.port || 8080, () =>
  console.log(`${server.name}$ listening at ${server.url}...
`));
