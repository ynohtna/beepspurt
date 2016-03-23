/* eslint-disable no-console */
import { createSocket } from 'dgram';
import { EventEmitter } from 'events';

const arrayBuffer = new ArrayBuffer(4);
const dataView = new DataView(arrayBuffer);

function readString(buffer, start) {
  const len = buffer.length;
  let end = start;

  // Seek to the end of the string (which will be terminated by 1-4 NULLs).
  while (end < len && buffer[end] !== 0) {
    end++;
  }

  // NOTE(deanm): At this point we could probably salvage the message and
  // take the string (which was probably truncated due to UDP packet size),
  // but it is probably the best decision to error out on malformed data.
  if (end >= len) {
    throw new Error('Encountered invalid OSC string, missing NULL termination.');
  }

  return buffer.toString('ascii', start, end);
}


function readFloat(buffer, pos) {
  dataView.setUint8(0, buffer[pos]);
  dataView.setUint8(1, buffer[pos + 1]);
  dataView.setUint8(2, buffer[pos + 2]);
  dataView.setUint8(3, buffer[pos + 3]);
  return dataView.getFloat32(0, false);
}

function readInt(buffer, pos) {
  dataView.setUint8(0, buffer[pos]);
  dataView.setUint8(1, buffer[pos + 1]);
  dataView.setUint8(2, buffer[pos + 2]);
  dataView.setUint8(3, buffer[pos + 3]);
  return dataView.getInt32(0, false);
}

function readBlob(buffer, start) {
  const len = readInt(buffer, start);
  return buffer.slice(start + 4, start + 4 + len);
}

function processMessageOrBundle(msg, remote, emitter, pos_ = 0) {
  let pos = pos_;

  const addr = readString(msg, pos);
  pos += addr.length + 4 - (addr.length & 3);

  if (addr === '#bundle') {
    pos += 8;  // Skip timetag, treat everything as 'immediately'.
    while (pos < msg.length) {
      const len = readInt(msg, pos);
      pos += 4;
      processMessageOrBundle(msg, remote, emitter, pos);
      pos += len;
    }
    return;
  }

  const typetags = readString(msg, pos);
  pos += typetags.length + 4 - (typetags.length & 3);

  // Advance past leading comma.
  if (typetags[0] !== ',') {
    console.error('Malformed OSC Type Tag String (missing leading comma)', typetags);
    return;
  }
  const tags = typetags.substr(1);

  const args = [];
  for (let i = 0, il = tags.length; i < il; ++i) {
    const tag = tags[i];
    switch (tag) {
      case 'T':
        args.push(true);
        break;
      case 'F':
        args.push(false);
        break;
      case 'N':
        args.push(null);
        break;
      case 'I':
        args.push(undefined);
        break;
      case 'f':
        args.push(readFloat(msg, pos));
        pos += 4;
        break;
      case 'i':
        args.push(readInt(msg, pos));
        pos += 4;
        break;
      case 's': {
        const str = readString(msg, pos);
        pos += str.length + 4 - (str.length & 3);
        args.push(str);
        break;
      }
      case 'b': {
        const bytes = readBlob(msg, pos);
        pos += 4 + bytes.length + ((4 - (bytes.length & 3)) & 3);
        args.push(bytes);
        break;
      }
      default:
        console.warn('WARNING: Unhandled OSC type tag', tag);
        break;
    }
  }

  emitter.emit('osc', {
    addr,
    tags,
    args,
    remote
  });
}

class Socket extends EventEmitter {
  constructor(options) {
    super();
    this.options_ = {
      port: 6339,
      exclusive: true,
      ...options
    };
    this.socket__ = null;
  }
  open() {
    this.socket_ = createSocket('udp4');
    this.socket_.on('close', ::this.onclosed);
    this.socket_.on('error', ::this.onerror);
    this.socket_.on('message', ::this.onmessage);
    this.socket_.bind(this.options_, ::this.onopened);
  }
  onopened() {
    this.emit('opened');
  }
  onerror(error) {
    console.error('socket error', error);
    this.emit('error', error);
  }
  onclosed() {
    this.emit('closed');
  }
  onmessage(msg, remote) {
    try {
      processMessageOrBundle(msg, remote, this);
    } catch (e) {
      console.error('OSC message error', e);
      this.emit('error', e);
    }
  }
  close() {
    if (this.socket_) {
      this.socket_.close();
      this.socket_ = null;
    }
  }
}
export default Socket;
