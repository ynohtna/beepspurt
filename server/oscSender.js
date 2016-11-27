/* eslint-disable no-param-reassign, no-console */
import { createSocket } from 'dgram';
import { EventEmitter } from 'events';

const arrayBuffer = new ArrayBuffer(4);
const dataView = new DataView(arrayBuffer);

function appendInt(octets, val) {
  dataView.setInt32(0, val, false);
  for (let i = 0; i < 4; ++i) {
    octets.push(dataView.getUint8(i));
  }
}

function appendFloat(octets, val) {
  dataView.setFloat32(0, val, false);
  for (let i = 0; i < 4; ++i) {
    octets.push(dataView.getUint8(i));
  }
}

function appendString(octets, str) {
  const len = str.length;
  for (let i = 0; i < len; ++i) {
    octets.push(str.charCodeAt(i) & 0x7f);  // Should be 7-bit clean right?
  }
  // We want to add the null byte and pad to 4 byte boundary.
  const nulls = 4 - (len & 3);  // Will always be at least 1 for terminator.
  for (let i = 0; i < nulls; ++i) {
    octets.push(0);
  }
}

function appendBlob(octets, val) {
  const len = val.length;
  appendInt(octets, len);

  // grow byte array and carve out space for the Blob
  const start = octets.length;
  octets.length += len;
  for (let i = 0; i < len; ++i) {
    octets[start + i] = val[i];
  }

  // We want to pad to 4 byte boundary.
  const nulls = (4 - (len & 3)) & 3;
  for (let i = 0; i < nulls; ++i) {
    octets.push(0);
  }
}

function makeMessageOctets(path, typetag, params) {
  const octets = [];
  appendString(octets, path);
  appendString(octets, `,${typetag}`);
  for (let i = 0, il = typetag.length; i < il; ++i) {
    const tag = typetag[i];
    switch (tag) {
      case 'i':
        appendInt(octets, params[i]);
        break;
      case 'f':
        appendFloat(octets, params[i]);
        break;
      case 's':
        appendString(octets, params[i]);
        break;
      case 'b':
        appendBlob(octets, params[i]);
        break;
      // Types with implicit parameters, just ignore the passed parameter.
      case 'T': case 'F': case 'N': case 'I':
        break;
      default:
        console.error(`Unknown OSC type: ${tag}`);
        break;
    }
  }
  return octets;
}


class OscSender extends EventEmitter {
  constructor(options) {
    super();
    this.options_ = {
      port: 7000,
      host: '127.0.0.1',
      ...options
    };
    this.socket_ = null;
  }
  open() {
    this.socket_ = createSocket('udp4');
    if (this.options_.broadcast) {
      this.socket_.setBroadcast(true);
    }
    this.socket_.on('close', ::this.onclosed);
    this.socket_.on('error', ::this.onerror);
  }
  onerror(error) {
    console.error('socket error', error);
    this.emit('error', error);
  }
  onclosed() {
    this.emit('closed');
  }
  send(path, typetag, params) {
    const { host, port } = this.options_;
    const octets = makeMessageOctets(path, typetag, params);
    const msg = new Buffer(octets);
    this.socket_.send(msg, 0, octets.length, port, host);
  }
  sendBundled(path, typetag, params) {
    const { host, port } = this.options_;
    const message = makeMessageOctets(path, typetag, params);
    let octets = [];
    appendString(octets, '#bundle');
    appendInt(octets, 0);
    appendInt(octets, 1);  // timetag now.
    appendInt(octets, message.length);
    octets = octets.concat(message);
    const msg = new Buffer(octets);
    this.socket_.send(msg, 0, octets.length, port, host);
  }
  close() {
    if (this.socket_) {
      this.socket_.close();
      this.socket_ = null;
    }
  }
}
export default OscSender;
