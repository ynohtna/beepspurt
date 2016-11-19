/* eslint-disable no-console */
/* eslint no-param-reassign: [2, {"props": false }] */
const util = require('util');
import chalk from 'chalk';
import { effects, isCancelError } from 'redux-saga';
const { /* call, */cancel, fork, /* put, */race, take } = effects;

const conlog = (...msgs) => console.log(chalk.blue.bold(...msgs));
const conwarn = (...msgs) => console.warn(chalk.magenta.bold(...msgs));
const conerr = (...msgs) => console.error(chalk.blue.inverse.white.bold(...msgs));

function* bounce(sender, action) {
  try {
    conlog('* EXT bounce');

    let msg = yield take(action);
    while (msg) {
      conlog('* EXT');
      conlog(util.inspect(msg));
      if (msg.payload && msg.payload.length) {
        const [path, tags, ...params] = msg.payload;
        sender.send(path, tags || '', params || []);
        conwarn(`* EXT ${action} send: ${path} "${tags}" ${params}`);
      }

      msg = yield take(action);
    }
  } catch (error) {
    if (!isCancelError(error)) {
      conerr(`* EXT ${action} error`, error);
      throw error;
    }
  }
}


const extSaga = (sender, action) => function* ext(...args) {
  conlog(`* extSaga ${action} ${util.inspect(args)}`);

  yield take('/plask/INIT');
  conlog('* extSaga/INIT');

  // Open socket.
  sender.open();

  const SOCKET_OPEN = `${action}/OPEN`;

  let awaitOpen = false;
  const active = true;
  while (active) {
    if (awaitOpen) { // Await user-initiated open socket request.
      yield take(SOCKET_OPEN);
      conlog(SOCKET_OPEN);
    }

    // Fork OSC message bounce.
    const bounceTask = yield fork(bounce, sender, action);

    // Race: didClose, close, error, open.
    const winner = yield race({
//      didClose: take(SOCKET_CLOSED),
//      erred: take(SOCKET_ERROR),
      close: take(`${action}/CLOSE`),
      open: take(SOCKET_OPEN)
    });
    conwarn(`***** extSaga ${action} race!`, winner, bounceTask.isRunning());

    // Cancel bounce.
    conwarn('cancelling bounce fetch');
    yield cancel(bounceTask);

    sender.close();

    // If socket closed or errored then await new open request, i.e. from direct user intervention.
    awaitOpen = !winner.open;
  }
};

export default extSaga;
