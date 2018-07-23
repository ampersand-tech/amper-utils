/**
* Copyright 2018-present Ampersand Technologies, Inc.
* @allowConsoleFuncs
*/
import { Stash, StashOf } from './types';
export declare function isObject(value: any): value is Stash;
export declare function fieldCount(obj: any): number;
export declare function shallowClone<T>(src: T): T;
export declare function shallowCloneExcludeFields<T>(src: T, toExclude: string[]): Partial<T>;
/**
 * Shallow clone, then copy fields.
 * @param src The object to clone.
 * @param replace The object to merge into src
 */
export declare function shallowCloneAndCopy<T, U>(src: T, replace: U): T & U;
export declare function cloneTruncate(srcObj: any, maxBytes: any): any;
export declare function cloneRecur(obj: any, depth: any): any;
export declare function clone<T>(srcObj: T): T;
export declare type ObjMask<T> = '*' | 1 | {
    [P in keyof T]?: ObjMask<T[P]>;
};
export declare function cloneExcludingFields<T>(srcObj: T, excludeFields?: ObjMask<T>): Partial<T>;
export declare function cloneWithCycle(rootObj: any, pruneCycles?: any): any;
export declare function cloneImmutable<T>(obj: T): Readonly<T>;
export declare function objectMakeImmutable<T>(obj: T, excludeFields?: any): Readonly<T>;
export declare function isImmutable(obj: any): boolean;
export declare function deepCompare(x: any, y: any): boolean;
export declare function cloneSomeFieldsImmutable<T>(obj: T, mask?: ObjMask<T> | string, defaults?: Partial<T>): Readonly<Partial<T>>;
/**
 * Copy properties from src into dst
 */
export declare function copyFields<T0, T1>(src: T0, dst: T1): T0 & T1;
export declare function copyFieldsErrIfSet(src: any, dst: any): any;
export declare function copyFieldsIfUnset(src: any, dst: any): any;
/**
 * Copy a subset of the fields of src into dst and return dst.
 */
export declare function copySomeFields(src: any, dst: any, fields: string[]): any;
export declare function cloneAndStrip(obj: any, fields: string[]): any;
export declare function objectTrim(obj: any): any;
export declare function objectSum(dst: any, src: any): void;
export declare function objIntersectionKeys(lhs: any, rhs: any): any;
export declare function objFindRHSOnlyKeys(lhs: any, rhs: any): string[];
export declare function objDiffKeys(lhs: any, rhs: any): string[];
export declare function objectValues(obj: any): any[];
export declare function objectMap<T, U>(obj: StashOf<T>, cb: (any: T, string: string) => U): StashOf<U>;
export declare function objectFilter<T>(obj: StashOf<T>, filter?: (el: T, key: string) => boolean): StashOf<T> | undefined;
/**
 * only checks keys directly on the object.
 */
export declare function objectKeysEqual(obj1: any, obj2: any): boolean;
export declare function objectSortKeys(obj: any, cmp?: (a: string, b: string) => number): any;
export declare function objSwapValues(a: any, b: any, keys: any): void;
export declare function safeObjIsEmpty(obj: Stash | undefined | null): boolean;
export declare function objectGetFromPath(obj: object | undefined, names: string[]): any;
export declare function objectFillPath(obj: object, path: string[], value: any): object | undefined;
export declare function objIncrementKey(obj: any, key: any): any;
export declare function objClear(obj: any): any;
export declare function objDiffRecur(path: any, diffs: any, ignoreMask: any, src: any, dst: any): any;
export declare function objDiff(src: any, dst: any, ignoreMask?: any): any;
export declare function objCmpMasked(src: any, dst: any, ignoreMask: any): boolean;
export declare type SortFn<T> = (a: T, b: T) => number;
export declare function objToArray<T>(obj: StashOf<T> | undefined, sortOpt?: SortFn<T>): any[];
export declare function objCmpFast(src?: any, dst?: any): boolean;
