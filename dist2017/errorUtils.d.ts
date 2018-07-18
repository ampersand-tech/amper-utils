/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/
import { ErrorObject, ErrorType } from './types';
export declare function errorToString(err: string | ErrorObject | undefined | null, allowStack: boolean): string;
export declare function errorToCode(err: ErrorType): string;
export declare function isNotFound(err: ErrorType): boolean;
