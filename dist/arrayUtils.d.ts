/**
* Copyright 2018-present Ampersand Technologies, Inc.
* @allowConsoleFuncs
*/
export declare function findIdxByKey(arr: any, key: any, id: any): number;
export declare function findByKey<T>(arr: T[], key: string, id: any): T | undefined;
export declare function removeByVal(arr: any, id: any): any;
export declare function toMap(arr: any, key: any): {} | undefined;
/**
 *
 * @param arr array of objects or primitives
 * @param keyPicker in the case of an array of objects, a function or key string to use for the resulting object's key
 */
export declare function arrayToObj<T extends object>(arr: (string | number | T)[], keyPicker?: Function | string): {};
export declare function arrayFill(length: any, value: any): any[];
export declare function arrayRepeat(array: any, times: any): never[];
export declare function arrayRange(startOrLength: number, end?: number, step?: number): number[];
export declare function arraySum<T, K extends keyof T>(arr: (number | T)[], keyOpt?: K): number;
type KeyedNumberObj = {
    [k: string]: number;
};
export declare function arrayMax(arr: number[]): number | undefined;
export declare function arrayMaxObj<T extends KeyedNumberObj, K extends keyof T>(arr: T[], key: K): number | undefined;
export declare function arrayMin(arr: number[]): number | undefined;
export declare function arrayMinObj<T extends KeyedNumberObj, K extends keyof T>(arr: T[], key: K): number | undefined;
export declare function arrayPull<T, K extends keyof T>(arrOfObjs: T[], key: K): (T[K] | undefined)[];
export declare function stringArrayMergeUnique(a: string[], b: string[]): string[];
export declare function cmpString(desc: boolean, a: string, b: string): number;
export declare function cmpStringOrUndefined(undefFirst: boolean, desc: boolean, caseSensitive: boolean, a: string | undefined, b: string | undefined): number;
export declare function cmpNum(desc: boolean, a: number, b: number): number;
export declare function forceArray(thing: any, shallowCln?: boolean): any[];
export declare function bsearch<T>(arr: T[], cmp: (elt: T) => number, len?: number): number;
export {};
