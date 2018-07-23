/**
* Copyright 2017-present Ampersand Technologies, Inc. *
*/

export type StashOf<T> = {[k: string]: T};
export type Stash = StashOf<any>;

export interface ErrorObject {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
  statusCode?: number;
}

export type ErrorType = undefined|null|string|ErrorObject;

export type NoErrDataCB<T> = (err: null|undefined, data: T) => void;
export type ErrDataCB<T> = (err?: ErrorType, data?: T) => void;
export type ErrWithDataCB<T> = (err: ErrorType, data: T) => void;

export declare function absurd(a: never): never;
