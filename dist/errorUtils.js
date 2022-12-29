"use strict";
/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotFound = exports.errorToCode = exports.errorToString = void 0;
function errorToString(err, allowStack) {
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
        }
        catch (_e) {
        }
    }
    return '<unknown>';
}
exports.errorToString = errorToString;
function errorToCode(err) {
    if (!err) {
        return '';
    }
    if (typeof err === 'string') {
        return err;
    }
    return err.code || err.message || '';
}
exports.errorToCode = errorToCode;
function isNotFound(err) {
    return err ? (errorToString(err, false) === 'not found') : false;
}
exports.isNotFound = isNotFound;
