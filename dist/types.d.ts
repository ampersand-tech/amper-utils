/**
* Copyright 2017-present Ampersand Technologies, Inc. *
*/
export declare type StashOf<T> = {
    [k: string]: T;
};
export declare type Stash = StashOf<any>;
export interface ErrorObject {
    name?: string;
    message?: string;
    stack?: string;
    code?: string;
    statusCode?: number;
}
export declare type ErrorType = undefined | null | string | ErrorObject;
export declare type NoErrDataCB<T> = (err: null | undefined, data: T) => void;
export declare type ErrDataCB<T> = (err?: ErrorType, data?: T) => void;
export declare type ErrWithDataCB<T> = (err: ErrorType, data: T) => void;
export declare function absurd(a: never): never;
