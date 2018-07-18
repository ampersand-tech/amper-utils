/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/

import { ErrorObject, ErrorType } from './types';

export function errorToString(err: string|ErrorObject|undefined|null, allowStack: boolean): string {
  if (typeof err === 'string') {
    return err;
  }
  if (!err) {
    return '';
  }
  if (allowStack && err.stack) {
    return err.stack;
  }
  if (err.message) {
    return err.message;
  }
  const errStr = '' + err;
  if (errStr && errStr !== '[object Object]') {
    return errStr;
  }
  if (allowStack) {
    try {
      return JSON.stringify(err); // @allowJsonFuncs
    } catch (_e) {
    }
  }
  return '<unknown>';
}

export function errorToCode(err: ErrorType): string {
  if (!err) {
    return '';
  }
  if (typeof err === 'string') {
    return err;
  }
  return err.code || err.message || '';
}

export function isNotFound(err: ErrorType) {
  return err ? (errorToString(err, false) === 'not found') : false;
}
