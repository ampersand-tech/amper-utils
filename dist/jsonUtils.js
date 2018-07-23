"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/
var objUtils_1 = require("./objUtils");
function safeParse(jsonStr) {
    if (!jsonStr) {
        return;
    }
    try {
        return JSON.parse(jsonStr); // @allowJsonFuncs
    }
    catch (e) {
        // ignore
    }
}
exports.safeParse = safeParse;
function safeStringify(val, maxBytes, pretty) {
    if (val === undefined) {
        return 'undefined';
    }
    if (val === null) {
        return 'null';
    }
    var str;
    try {
        // try vanilla stringify first, because it is fastest
        str = JSON.stringify(val, undefined, pretty ? 2 : undefined); // @allowJsonFuncs
    }
    catch (e1) {
        try {
            str = JSON.stringify(objUtils_1.cloneWithCycle(val, true), undefined, pretty ? 2 : undefined); // @allowJsonFuncs
        }
        catch (e2) {
            str = '<error>';
        }
    }
    if (!maxBytes) {
        return str;
    }
    return str.slice(0, maxBytes);
}
exports.safeStringify = safeStringify;
function prettyStringify(val) {
    return safeStringify(val, undefined, true);
}
exports.prettyStringify = prettyStringify;
function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj)); // @allowJsonFuncs
}
exports.jsonClone = jsonClone;
