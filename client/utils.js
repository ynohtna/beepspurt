/* eslint no-param-reassign: [2, {"props": false }] */

// --- Saga stuff: cancellable promise & delayed resolve.
import { utils } from 'redux-saga';
const { CANCEL } = utils;

export const cancellablePromise = (p, doCancel) => {
  p[CANCEL] = doCancel;
  return p;
};

export const delayedResolve = ms => new Promise(resolve => setTimeout(() => resolve(true), ms));

// ---- High-resolution timer
export const now = () => window.performance.now();
export const since = (then) => (window.performance.now() - then);

// ---- URL stuff: convert browser location to websocket endpoint.
const domainRegex = /[a-zA-Z0-9\-\.]+/;
const portRegex = /(:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}))/;

export const endpointFromWindowLocation = location => {
  const loc = (typeof location === 'string') ? location : location.toString();
  const regex = new RegExp(domainRegex.source + portRegex.source);
  const socketIPAndPort = regex.exec(loc.toString()).shift();
  const pieces = socketIPAndPort.split(':');
  const socketString = ['ws://', pieces[0], ':', parseInt(pieces[1], 10)].join('');
  return socketString;
};

// ---- Unicode: convert Unicode hex code point into glyph pair.
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

// ---- Alignment: convert enumerated values into classes.
const halignClasses = ['h-left', 'h-center', 'h-right'];
const valignClasses = ['v-top', 'v-middle', 'v-bottom'];

const safeLookup = (a, i) => {
  try {
    return a[i | 0];
  } catch (e) {
    return a[0];
  }
};

export const halignClassLookup = halign => safeLookup(halignClasses, halign);
export const valignClassLookup = valign => safeLookup(valignClasses, valign);

// ---- shallowEqual
export function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}
