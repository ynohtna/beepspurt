/* eslint no-param-reassign: [2, {"props": false }] */
import { utils } from 'redux-saga';
const { CANCEL } = utils;

export const cancellablePromise = (p, doCancel) => {
  p[CANCEL] = doCancel;
  return p;
};

export const delayedResolve = ms => new Promise(resolve => setTimeout(() => resolve(true), ms));
