const restify = require('restify');

const server = restify.createServer();

server.pre(restify.pre.userAgentConnection());
server.get('/', (req, res, next) => {
  console.log(`${req.serverName}$ ${req.method} ${req.url}
    ${req.headers.host} ${req.headers['user-agent']} ${req.headers.accept}
`);
  res.send('OK, senora');
  next();
});

server.listen(process.env.PORT || 9336, () =>
  console.log(`${server.name}$ listening at ${server.url}...
`)
);
