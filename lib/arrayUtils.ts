/**
* Copyright 2018-present Ampersand Technologies, Inc.
* @allowConsoleFuncs
*/


export function findIdxByKey(arr, key, id) {
  if (!arr) {
    return -1;
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i][key] === id) {
      return i;
    }
  }
  return -1;
}

export function findByKey<T>(arr: T[], key: string, id: any): T|undefined {
  let idx = findIdxByKey(arr, key, id);
  if (idx >= 0) {
    return arr[idx];
  }
}

export function removeByVal(arr, id) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === id) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

export function toMap(arr, key) {
  if (!key) {
    return;
  }
  let map = {};
  for (let i = 0; i < arr.length; i++) {
    let src = arr[i];
    map[src[key]] = arr[i];
  }
  return map;
}


/**
 *
 * @param arr array of objects or primitives
 * @param keyPicker in the case of an array of objects, a function or key string to use for the resulting object's key
 */
export function arrayToObj<T extends object>(arr: (string | number | T)[], keyPicker?: Function | string): {} {
  if (!Array.isArray(arr)) {
    console.error('arrayToObj.notArray', arr);
    return {};
  }
  let obj = {};
  for (let i = 0; i < arr.length; ++i) {
    let v: any;
    let a = arr[i];
    let k: string | number | undefined;
    if (typeof a === 'number' || typeof a === 'string') {
      k = a;
      v = true;
    } else if (a !== null && typeof a === 'object') {
      if (typeof keyPicker === 'string') {
        k = a[keyPicker];
      } else if (typeof keyPicker === 'function') {
        k = keyPicker(a);
      } else {
        k = i;
      }
      v = a;
    }
    if (k === undefined || k === null) {
      console.error(`arrayToObj.undefinedKey-- i: ${i}, k: ${k}`);
      continue;
    }
    if (typeof(k) !== 'number' && typeof(k) !== 'string') {
      console.error(`arrayToObj.invalidKey-- i: ${i}, type: ${typeof(k)}, k: ${k}`);
      continue;
    }
    if (obj.hasOwnProperty(k as string)) {
      console.error(`arrayToObj.duplicateKeys-- k: ${k}, i: ${i}, a: ${a}`);
      continue;
    }
    obj[k] = v;
  }
  return obj;
}

export function arrayFill(length, value) {
  let res = new Array(length);
  for (let i = res.length - 1; i >= 0; i--) {
    res[i] = value;
  }
  return res;
}

export function arrayRepeat(array, times) {
  let res = [];
  for (let i = 0; i < times; ++i) {
    res = res.concat(array);
  }
  return res;
}

export function arrayRange(startOrLength: number, end?: number, step?: number): number[] {
  let start;
  let dir = 1;
  if (end === undefined) {
    start = 0;
    end = startOrLength;
  } else {
    start = startOrLength;
  }

  if (!step) {
    step = 1;
  }
  if (step < 0) {
    dir = -1;
  }

  let res = [] as any[];
  for (let i = 0, cur = start; dir * cur < dir * end; i++, cur += step) {
    res[i] = cur;
  }
  return res;
}

export function arraySum<T, K extends keyof T>(arr: (number|T)[], keyOpt?: K): number {
  let s = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    let v;
    if (arr[i] && typeof(arr[i]) === 'object' && keyOpt) {
      v = (arr[i] as T)[keyOpt];
    } else {
      v = arr[i];
    }
    s += (v || 0);
  }
  return s;
}

function arrayMinMaxHelper(arr: number[], isMax: boolean): number | undefined {
  let s = undefined as number | undefined;
  for (let v of arr) {
    if (isNaN(v)) {
      continue;
    } else if (s === undefined || (isMax ? s < v : s > v)) {
      s = v;
    }
  }
  return s;
}

type KeyedNumberObj = {
  [k: string]: number,
};

function arrayMinMaxObjHelper<T extends KeyedNumberObj, K extends keyof T>(arr: T[], key: K, isMax: boolean): number | undefined {
  let s = undefined as number | undefined;
  for (let o of arr) {
    let v = o[key];
    if (isNaN(v)) {
      continue;
    }
    if (s === undefined || (isMax ? s < v : s > v)) {
      s = v;
    }
  }
  return s;
}

export function arrayMax(arr: number[]): number | undefined {
  return arrayMinMaxHelper(arr, true);
}

export function arrayMaxObj<T extends KeyedNumberObj, K extends keyof T>(arr: T[], key: K): number | undefined {
  return arrayMinMaxObjHelper(arr, key, true);
}

export function arrayMin(arr: number[]): number | undefined {
  return arrayMinMaxHelper(arr, false);
}

export function arrayMinObj<T extends KeyedNumberObj, K extends keyof T>(arr: T[], key: K): number | undefined {
  return arrayMinMaxObjHelper(arr, key, false);
}

export function arrayPull<T, K extends keyof T>(arrOfObjs: T[], key: K): (T[K]|undefined)[] {
  let res = [] as (T[K]|undefined)[];
  for (let i = 0; i < arrOfObjs.length; i++) {
    let obj = arrOfObjs[i];
    // typeof null is 'object'!
    if (typeof(obj) !== 'object' || obj === null) {
      res.push(undefined);
    } else {
      res.push(obj[key]);
    }
  }
  return res;
}

export function stringArrayMergeUnique(a: string[], b: string[]): string[] {
  const uniq = {};
  for (let i = 0; i < a.length; ++i) {
    uniq[a[i]] = 1;
  }
  for (let i = 0; i < b.length; ++i) {
    uniq[b[i]] = 1;
  }
  return Object.keys(uniq);
}

export function cmpString(desc: boolean, a: string, b: string): number {
  let val = 0;
  if (a > b) {
    val = 1;
  } else if (b > a) {
    val = -1;
  }
  return (desc ? -val : val);
}

export function cmpStringOrUndefined(undefFirst: boolean, desc: boolean, caseSensitive: boolean,
  a: string | undefined, b: string | undefined): number {
  if (a === undefined) {
    if (b === undefined) {
      return 0;
    }
    return undefFirst === desc ? 1 : -1;
  } else if (b === undefined) {
    return undefFirst === desc ? -1 : 1;
  }
  if (!caseSensitive) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  return cmpString(desc, a, b);
}

export function cmpNum(desc: boolean, a: number, b: number) {
  return (desc ? (b - a) : (a - b));
}

export function forceArray(thing, shallowCln = false) {
  if (Array.isArray(thing)) {
    if (shallowCln) {
      let ret = [] as any[];
      for (let i = 0; i < thing.length; ++i) {
        ret.push(thing[i]);
      }
      return ret;
    }
    return thing;
  } else if (thing === undefined || thing === null) {
    return [];
  } else {
    return [thing];
  }
}

// Len is optional for arrays, required for array-like-objects.
export function bsearch<T>(arr: T[], cmp: (elt: T) => number, len?: number) {
  let mn = 0;
  let mx = len || arr.length;
  let i;
  let res = -1;
  while (mn < mx) {
    i = (mx + mn) / 2 | 0;
    let op = cmp(arr[i]);
    if (op < 0) {
      mx = i;
    } else if (op > 0) {
      mn = i + 1;
    } else {
      res = i;
      break;
    }
  }
  return res;
}
