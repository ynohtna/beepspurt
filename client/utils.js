/* eslint no-param-reassign: [2, {"props": false }] */
import { utils } from 'redux-saga';
const { CANCEL } = utils;

export const cancellablePromise = (p, doCancel) => {
  p[CANCEL] = doCancel;
  return p;
};

export const delayedResolve = ms => new Promise(resolve => setTimeout(() => resolve(true), ms));


const domainRegex = /[a-zA-Z0-9\-\.]+/;
const portRegex = /(\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}))/;

export const endpointFromWindowLocation = location => {
  const loc = (typeof location === 'string') ? location : location.toString();
  const regex = new RegExp(domainRegex.source + portRegex.source);
  const socketIPAndPort = regex.exec(loc.toString()).shift();
  const pieces = socketIPAndPort.split(':');
  const socketString = ['ws://', pieces[0], ':', parseInt(pieces[1], 10)].join('');
  return socketString;
};

export const fixedFromCharCode = codePt => {
  let s;
  if (codePt > 0xFFFF) {
    const code = codePt - 0x10000;
    s = String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
  } else {
    s = String.fromCharCode(codePt);
  }
  return s;
};
