/**
* Copyright 2018-present Ampersand Technologies, Inc.
* @allowConsoleFuncs
*/

import { Stash } from './types';

declare var Blob: any;

export function isObject(value): value is Stash {
  return typeof(value) === 'object' && value !== null && !Array.isArray(value);
}

export function fieldCount(obj) {
  let count = 1; // count ourselves
  if (typeof obj === 'object' && obj !== null) {
    // Count our children
    for (let key in obj) {
      count += fieldCount(obj[key]);
    }
  }
  return count;
}


export function shallowClone<T>(src: T): T {
  const dst = {} as T;
  for (let key in src) {
    dst[key] = src[key];
  }
  return dst;
}

export function shallowCloneExcludeFields<T>(src: T, toExclude: string[]): Partial<T> {
  const dst = shallowClone(src) as any;
  for (const field of toExclude) {
    delete dst[field];
  }
  return dst;
}

/**
 * Shallow clone, then copy fields.
 * @param src The object to clone.
 * @param replace The object to merge into src
 */
export function shallowCloneAndCopy<T, U>(src: T, replace: U): T & U {
  let dst = shallowClone(src);
  copyFields(replace, dst);
  return dst as T & U;
}

export function cloneTruncate(srcObj, maxBytes) {
  let noted = false;
  let endNote = '...';
  return cloneRecurTruncate(srcObj);

  function cloneRecurTruncate(obj) {
    if (maxBytes < 0) {
      noted = true;
      return endNote;
    }
    // Handle the 3 simple types, and null or undefined
    if ('object' !== typeof obj || null === obj) {
      if (typeof obj === 'string') {
        if (obj.length > maxBytes) {
          obj = obj.substring(0, maxBytes) + endNote;
          noted = true;
        }
        maxBytes -= obj.length;
      } else {
        maxBytes -= 5;
      }
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    let copy;
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0; i < obj.length; i++) {
        copy[i] = cloneRecurTruncate(obj[i]);
        if (maxBytes < 0) {
          if (!noted) {
            copy[i] = endNote;
            noted = true;
          }
          break;
        }
      }
      return copy;
    }

    copy = {};
    for (let id in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, id)) {
        copy[id] = cloneRecurTruncate(obj[id]);
        if (maxBytes < 0) {
          if (!noted) {
            copy[id] = endNote;
            noted = true;
          }
          break;
        }
      }
    }
    return copy;
  }
}

export function cloneRecur(obj, depth) {
  if (++depth > 100) {
    throw 1;
  }
  // Handle the 3 simple types, and null or undefined
  if ('object' !== typeof obj || null === obj) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  // slightly hacky check for being in a browser
  if (typeof Blob !== 'undefined' && obj instanceof Blob) {
    // quoting MDN: "A Blob object represents a file-like object of immutable, raw data."
    return obj;
  }

  let copy;
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = cloneRecur(obj[i], depth);
    }
    return copy;
  }

  copy = {};
  for (let id in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, id)) { // removing this check would give 50% speed improvement
      copy[id] = cloneRecur(obj[id], depth);
    }
  }
  return copy;
}

export function clone<T>(srcObj: T): T {
  // early out for uncloneable values
  if ('object' !== typeof srcObj || null === srcObj) {
    return srcObj;
  }

  let ret;
  try {
    ret = cloneRecur(srcObj, 0);
  } catch (e) {
    if (e === 1) {
      console.error('Util.clone srcObj has depth > 100', {e: e, obj: cloneWithCycle(srcObj, true)});
      return cloneWithCycle(srcObj);
    } else {
      console.error('Util.clone error', {e, srcObj});
    }
  }
  return ret;
}

// valid masks are:
// foo = '*'
// foo = {bar: '*', baz: 1, fizz: {...}}
export type ObjMask<T> = '*' | 1 | { [P in keyof T]?: ObjMask<T[P]> };

// useful for cloning things that don't have just plain data
export function cloneExcludingFields<T>(srcObj: T, excludeFields?: ObjMask<T>): Partial<T> {
  if (srcObj === null || srcObj === undefined || typeof(srcObj) !== 'object') {
    return srcObj;
  }
  let res = Array.isArray(srcObj) ? [] : {} as any;
  for (let k in srcObj) {
    if (excludeFields) {
      if (excludeFields === '*' || (excludeFields !== 1 && excludeFields[k] && !isObject(excludeFields[k]))) {
        continue;
      }
    }
    let exclude;
    if (excludeFields && typeof(excludeFields) === 'object') {
      exclude = excludeFields[k];
    }
    res[k] = cloneExcludingFields(srcObj[k], exclude);
  }
  return res;
}

export function cloneWithCycle(rootObj, pruneCycles?) {
  return cloneRec(rootObj, [], []);
  function cloneRec(obj, seenObjs, seenValues) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || 'object' !== typeof obj) {
      return obj;
    }

    let existingIdx = seenObjs.indexOf(obj);
    if (existingIdx >= 0) {
      if (pruneCycles) {
        return '<link cycle>';
      } else {
        return seenValues[existingIdx];
      }
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      seenObjs.push(obj);
      seenValues.push(copy);
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = cloneRec(obj[i], seenObjs, seenValues);
      }
      return copy;
    }

    // Handle Object
    copy = {};
    seenObjs.push(obj);
    seenValues.push(copy);
    for (let attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) {
        try {
          copy[attr] = cloneRec(obj[attr], seenObjs, seenValues);
        } catch (ex) {
          copy[attr] = '<caught exception>';
        }
      }
    }
    return copy;
  }
}

export function cloneImmutable<T>(obj: T): Readonly<T> {
  let copy = clone(obj);
  return objectMakeImmutable(copy);
}
export function objectMakeImmutable<T>(obj: T, excludeFields?): Readonly<T> {
  if (null === obj || 'object' !== typeof obj) {
    return obj;
  }
  Object.freeze(obj);

  for (let k in obj) {
    let exclude = excludeFields && excludeFields[k];
    if (exclude && !isObject(exclude)) {
      continue;
    }
    if (k === 'renderCache') {
      console.error('objectMakeImmutable.invalidFreeze', obj);
    }
    if (obj.hasOwnProperty(k)) {
      objectMakeImmutable(obj[k], exclude);
    }
  }
  return obj;
}

export function isImmutable(obj) {
  if (typeof(obj) !== 'object') {
    return true;
  }
  if (!Object.isFrozen(obj)) {
    return false;
  }
  for (let k in obj) {
    let o = obj[k];
    if (!isImmutable(o)) {
      return false;
    }
  }
  return true;
}

export function deepCompare( x, y ) {
  if (x === y) {
    return true;
  }

  if (!( x instanceof Object ) || !( y instanceof Object ) ) {
    return false;
  }

  for (let p in x ) {
    if (!deepCompare( x[p],  y[p] ) ) {
      return false;
    }
  }

  for (let p in y) {
    if (!(x.hasOwnProperty(p))) {
      return false;
    }
  }

  return true;
}

// NOTE: return type has Partial to encourage users of this to type their masks.
export function cloneSomeFieldsImmutable<T>(obj: T, mask?: ObjMask<T> | string, defaults?: Partial<T>): Readonly<Partial<T>> {
  let copy;
  let i;

  if (defaults !== undefined && (obj === null || obj === undefined)) {
    obj = defaults as T;
  }

  // Handle the 3 simple types, and null or undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (!mask || mask === '*') {
    return cloneImmutable(obj);
  }
  if (mask === 1) {
    return {} as any;
  }

  let submask = (mask as any)._ids; // not great type safety here
  if (submask) {
    if (obj instanceof Array) {
      copy = [];
      for (i = 0; i < obj.length; i++) {
        if (submask instanceof Object) {
          copy.push(cloneSomeFieldsImmutable(obj[i], submask, defaults && (defaults as any)._ids));
        } else {
          copy.push(i);
        }
      }
    } else if (obj instanceof Object) {
      copy = {};
      for (let id in obj) {
        if (submask instanceof Object) {
          copy[id] = cloneSomeFieldsImmutable(obj[id], submask, defaults && (defaults as any)._ids);
        } else {
          copy[id] = 1;
        }
      }
    }
  } else if (typeof(mask) === 'object') {
    copy = {};
    for (let key in mask) {
      let maskVal = mask[key];
      let objVal;

      if (!obj.hasOwnProperty(key) && (!defaults || !defaults.hasOwnProperty(key))) {
        // key is in the mask but not in the object or the defaults, so leave it out of the copy object
        continue;
      }

      if (obj[key] === undefined) {
        objVal = defaults && clone(defaults[key]);
      } else {
        objVal = obj[key];
      }

      if (typeof(maskVal) === 'object') {
        if (objVal instanceof Object) {
          copy[key] = cloneSomeFieldsImmutable(objVal, maskVal, defaults && defaults[key] as any);
        } else if (objVal instanceof Array) {
          copy[key] = [];

          for (i = 0; i < objVal.length; i++) {
            let dk = (defaults && defaults[key]);
            copy[key].push(cloneSomeFieldsImmutable(objVal[i], maskVal, dk && dk[i]));
          }
        } else if (objVal instanceof Date) {
          copy[key] = new Date();
          copy[key].setTime(objVal.getTime());
        } else {
          copy[key] = objVal;
        }
      } else if (maskVal === '*') {
        if (objVal instanceof Date) {
          copy[key] = new Date();
          copy[key].setTime(objVal.getTime());
        } else if (objVal instanceof Array) {
          copy[key] = cloneImmutable(objVal);
        } else if (objVal instanceof Function) {
          copy[key] = objVal;
        } else if (objVal instanceof Object) {
          copy[key] = cloneImmutable(objVal);
        } else {
          copy[key] = objVal;
        }
      } else {
        if (objVal instanceof Date) {
          copy[key] = new Date();
          copy[key].setTime(objVal.getTime());
        } else if (objVal instanceof Array) {
          copy[key] = objVal.length;
        } else if (objVal instanceof Function) {
          copy[key] = objVal;
        } else if (objVal instanceof Object) {
          copy[key] = {};
        } else {
          copy[key] = objVal;
        }
      }
    }
  } else {
    console.error('cloneSomeFieldsImmutable.invalidMask', {mask: mask});
  }

  return Object.freeze(copy);
}

/**
 * Copy properties from src into dst
 */
export function copyFields<T0, T1>(src: T0, dst: T1): T0&T1 {
  for (let key in src) {
    (dst as any)[key] = src[key];
  }
  return dst as T0&T1;
}

export function copyFieldsErrIfSet(src, dst) {
  let dupes = objIntersectionKeys(src, dst);
  if (dupes.length) {
    console.error('copyFieldsErrIfSet.existing keys', dupes);
    return;
  }
  copyFields(src, dst);
  return dst;
}

export function copyFieldsIfUnset(src, dst) {
  for (let key in src) {
    if (!dst.hasOwnProperty(key)) {
      dst[key] = src[key];
    }
  }
  return dst;
}

/**
 * Copy a subset of the fields of src into dst and return dst.
 */
export function copySomeFields(src, dst, fields: string[]) {
  dst = dst || {};
  for (const key of fields) {
    if (src[key] !== undefined) {
      dst[key] = src[key];
    }
  }
  return dst;
}

export function cloneAndStrip(obj, fields: string[]) {
  let objCopy = clone(obj);
  for (let i = 0; i < fields.length; i++) {
    delete objCopy[fields[i]];
  }
  return objCopy;
}

// remove empty subobjects
export function objectTrim(obj) {
  for (let k in obj) {
    if (!isObject(obj[k])) {
      continue;
    }
    objectTrim(obj[k]);
    if (Object.keys(obj[k]).length === 0) {
      delete obj[k];
    }
  }
  return obj;
}

// Add all numbers in src to dst, creating the key if necessary
export function objectSum(dst, src) {
  for (let key in src) {
    if (dst.hasOwnProperty(key)) {
      if (typeof dst[key] === 'object') {
        objectSum(dst[key], src[key]);
      } else {
        dst[key] += src[key];
      }
    } else {
      dst[key] = clone(src[key]);
    }
  }
}

export function objIntersectionKeys(lhs, rhs) {
  let k;
  let res = [] as any;
  for (k in lhs) {
    if (k in rhs) {
      res.push(k);
    }
  }
  return res;
}

export function objFindRHSOnlyKeys(lhs, rhs) {
  let lhsMissing: string[] = [];
  for (let k in rhs) {
    if (k in lhs) {
      continue;
    }
    lhsMissing.push(k);
  }
  return lhsMissing;
}

export function objDiffKeys(lhs, rhs) {
  return objFindRHSOnlyKeys(lhs, rhs).concat(objFindRHSOnlyKeys(rhs, lhs));
}

// Return the values in an object as an array
export function objectValues(obj) {
  let a = [] as any[];
  for (let idx in obj) {
    if (!obj.hasOwnProperty(idx)) {
      continue;
    }
    a.push(obj[idx]);
  }
  return a;
}

export function objectMap<T, U>(obj: Stash<T>, cb: (any: T, string: string) => U): Stash<U> {
  let res = {};
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    res[key] = cb(obj[key], key);
  }
  return res;
}

export function objectFilter<T>(obj: Stash<T>, filter?: (el: T, key: string) => boolean): Stash<T>|undefined {
  if (!obj) {
    return;
  }
  const res = {};
  for (const k in obj) {
    const v = obj[k];
    if (!filter && (v === null || v === undefined)) {
      continue;
    } else if (filter && !filter(v, k)) {
      continue;
    }
    res[k] = v;
  }
  return res;
}

/**
 * only checks keys directly on the object.
 */
export function objectKeysEqual(obj1, obj2): boolean {
  let keys1 = Object.keys(obj1);
  if (keys1.length !== Object.keys(obj2).length) {
    return false;
  }
  for (let i = 0; i < keys1.length; ++i) {
    let k = keys1[i];
    if (!obj2.hasOwnProperty(k)) {
      return false;
    }
  }
  return true;
}

export function objectSortKeys(obj, cmp?: (a: string, b: string) => number) {
  if (!obj) {
    return obj;
  }
  let keys = Object.keys(obj);
  if (keys.length <= 1) {
    return obj;
  }

  keys = keys.sort(cmp);
  let out = {};
  for (let i = 0; i < keys.length; ++i) {
    out[keys[i]] = obj[keys[i]];
  }
  return out;
}

export function objSwapValues(a, b, keys) {
  for (let i = 0; i < keys.length; ++i) {
    let k = keys[i];
    let tmp = a[k];
    a[k] = b[k];
    b[k] = tmp;
  }
}

export function safeObjIsEmpty(obj: Stash|undefined|null): boolean {
  if (!obj) {
    return true;
  }
  for (const _x in obj) {
    return false;
  }
  return true;
}

// {foo: {bar: {baz: 1}}} with ['foo','bar','baz'] => 1
export function objectGetFromPath(obj: object | undefined, names: string[]): any {
  if (!obj || !Array.isArray(names)) {
    return;
  }
  for (let i = 0; i < names.length; i++) {
    let name = names[i];
    if (!obj || typeof obj !== 'object') {
      return;
    }
    obj = obj[name];
  }
  return obj;
}

export function objectFillPath(obj: object, path: string[], value: any) {
  if (!obj || !path || value === undefined) {
    console.error('objectFillPath invalid call', {obj: obj, path: path});
    return;
  }

  for (let i = 0; i < path.length - 1; ++i) {
    let name = path[i];
    if (obj[name] && typeof obj[name] !== 'object') {
      return;
    }
    if (obj[name] === null || obj[name] === undefined) {
      obj[name] = {};
    }
    obj = obj[name];
  }
  if (obj && typeof obj === 'object') {
    obj[path[path.length - 1]] = value;
    obj = value;
  } else {
    return undefined;
  }
  return obj;
}

export function objIncrementKey(obj, key) {
  if (!obj[key]) {
    obj[key] = 1;
  } else {
    obj[key]++;
  }
  return obj[key];
}

export function objClear(obj) {
  if (Array.isArray(obj)) {
    obj.splice(0, obj.length);
    return obj;
  }
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      delete obj[k];
    }
  }
  return obj;
}

export function objDiffRecur(path, diffs, ignoreMask, src, dst) {
  if (src === dst) {
    return diffs;
  }
  if (src === null || src === undefined || dst === null || dst === undefined) {
    diffs.push({path: path, src: (src === undefined ? 'undefined' : src), dst: (dst === undefined ? 'undefined' : dst)});
  } else if (typeof src === 'object') {
    let id, visited = {};
    let maskVal;
    for (id in src) {
      maskVal = ignoreMask[id] || ignoreMask._ids || {};
      if (maskVal && typeof(maskVal) !== 'object') {
        continue;
      }
      let newPath = path + '.' + id;
      if (Array.isArray(src)) {
        newPath = path + '[' + id + ']';
      }
      objDiffRecur(newPath, diffs, maskVal, src[id], dst[id]);
      visited[id] = 1;
    }
    for (id in dst) {
      if (visited[id]) {
        continue;
      }
      maskVal = ignoreMask[id] || ignoreMask._ids || {};
      if (maskVal && typeof(maskVal) !== 'object') {
        continue;
      }
      objDiffRecur(path + '.' + id, diffs, maskVal, src[id], dst[id]);
    }
  } else {
    diffs.push({path: path, src: src, dst: dst});
  }
  return diffs;
}

export function objDiff(src, dst, ignoreMask?) {
  return objDiffRecur('root', [], ignoreMask || {}, src, dst);
}

export function objCmpMasked(src, dst, ignoreMask): boolean {
  return objDiff(src, dst, ignoreMask).length === 0;
}

export type SortFn<T> = (a: T, b: T) => number;
export function objToArray<T>(obj: Stash<T>|undefined, sortOpt?: SortFn<T>) {
  const res = [] as any[];
  if (obj) {
    for (let k in obj) {
      let o = obj[k];
      res.push(o);
    }
    if (sortOpt) {
      res.sort(sortOpt);
    }
  }
  return res;
}

// only returns true or false, true means they are the same
// supports objects, strings, numbers, arrays, even functions (pointers)
export function objCmpFast(src?: any, dst?: any): boolean {
  try {
    return objCmpFastInternal(src, dst, 0);
  } catch (e) {
    if (e === 'obj_too_deep') {
      console.error('objCmpFast object too deep, or circular');
    } else {
      console.error('objCmpFast caught exception', e);
    }
  }
  return false;
}

function objCmpFastInternal(src: any, dst: any, recurDepth: number): boolean {
  // check plain old types
  if (typeof(src) !== 'object' || typeof(dst) !== 'object' || src === null || dst === null) {
    return src === dst;
  }

  let sKeys = Object.keys(src);
  let dKeys = Object.keys(dst);
  if (sKeys.length !== dKeys.length) {
    return false; // Different number of keys
  }

  if (recurDepth > 20) {
    throw 'obj_too_deep';
  }
  recurDepth++;

  for (let i = 0; i < sKeys.length; ++i) {
    let s = src[sKeys[i]];
    let d = dst[sKeys[i]];
    if (!objCmpFastInternal(s, d, recurDepth)) {
      return false;
    }
  }
  return true;
}
