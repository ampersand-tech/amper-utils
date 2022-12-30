/**
* Copyright 2015-present Ampersand Technologies, Inc.
*/
export type AnyFunc = (...params: any[]) => any;
export declare function getFunctionParamNames(func: AnyFunc): string[];
