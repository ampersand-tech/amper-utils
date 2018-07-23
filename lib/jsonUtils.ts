/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/
import { cloneWithCycle } from './objUtils';

export function safeParse(jsonStr: string) {
  if (!jsonStr) {
    return;
  }
  try {
    return JSON.parse(jsonStr); // @allowJsonFuncs
  } catch (e) {
    // ignore
  }
}

export function safeStringify(val: any, maxBytes?: number, pretty?: boolean): string {
  if (val === undefined) {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }

  let str;
  try {
    // try vanilla stringify first, because it is fastest
    str = JSON.stringify(val, undefined, pretty ? 2 : undefined); // @allowJsonFuncs
  } catch (e1) {
    try {
      str = JSON.stringify(cloneWithCycle(val, true), undefined, pretty ? 2 : undefined); // @allowJsonFuncs
    } catch (e2) {
      str = '<error>';
    }
  }
  if (!maxBytes) {
    return str;
  }
  return str.slice(0, maxBytes);
}

export function prettyStringify(val: any) {
  return safeStringify(val, undefined, true);
}

export function jsonClone(obj) {
  return JSON.parse(JSON.stringify(obj)); // @allowJsonFuncs
}
