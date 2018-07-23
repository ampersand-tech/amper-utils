"use strict";
/**
* Copyright 2018-present Ampersand Technologies, Inc.
* @allowConsoleFuncs
*/
Object.defineProperty(exports, "__esModule", { value: true });
function findIdxByKey(arr, key, id) {
    if (!arr) {
        return -1;
    }
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i][key] === id) {
            return i;
        }
    }
    return -1;
}
exports.findIdxByKey = findIdxByKey;
function findByKey(arr, key, id) {
    var idx = findIdxByKey(arr, key, id);
    if (idx >= 0) {
        return arr[idx];
    }
}
exports.findByKey = findByKey;
function removeByVal(arr, id) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === id) {
            arr.splice(i, 1);
        }
    }
    return arr;
}
exports.removeByVal = removeByVal;
function toMap(arr, key) {
    if (!key) {
        return;
    }
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        var src = arr[i];
        map[src[key]] = arr[i];
    }
    return map;
}
exports.toMap = toMap;
/**
 *
 * @param arr array of objects or primitives
 * @param keyPicker in the case of an array of objects, a function or key string to use for the resulting object's key
 */
function arrayToObj(arr, keyPicker) {
    if (!Array.isArray(arr)) {
        console.error('arrayToObj.notArray', arr);
        return {};
    }
    var obj = {};
    for (var i = 0; i < arr.length; ++i) {
        var v = void 0;
        var a = arr[i];
        var k = void 0;
        if (typeof a === 'number' || typeof a === 'string') {
            k = a;
            v = true;
        }
        else if (a !== null && typeof a === 'object') {
            if (typeof keyPicker === 'string') {
                k = a[keyPicker];
            }
            else if (typeof keyPicker === 'function') {
                k = keyPicker(a);
            }
            else {
                k = i;
            }
            v = a;
        }
        if (k === undefined || k === null) {
            console.error("arrayToObj.undefinedKey-- i: " + i + ", k: " + k);
            continue;
        }
        if (typeof (k) !== 'number' && typeof (k) !== 'string') {
            console.error("arrayToObj.invalidKey-- i: " + i + ", type: " + typeof (k) + ", k: " + k);
            continue;
        }
        if (obj.hasOwnProperty(k)) {
            console.error("arrayToObj.duplicateKeys-- k: " + k + ", i: " + i + ", a: " + a);
            continue;
        }
        obj[k] = v;
    }
    return obj;
}
exports.arrayToObj = arrayToObj;
function arrayFill(length, value) {
    var res = new Array(length);
    for (var i = res.length - 1; i >= 0; i--) {
        res[i] = value;
    }
    return res;
}
exports.arrayFill = arrayFill;
function arrayRepeat(array, times) {
    var res = [];
    for (var i = 0; i < times; ++i) {
        res = res.concat(array);
    }
    return res;
}
exports.arrayRepeat = arrayRepeat;
function arrayRange(startOrLength, end, step) {
    var start;
    var dir = 1;
    if (end === undefined) {
        start = 0;
        end = startOrLength;
    }
    else {
        start = startOrLength;
    }
    if (!step) {
        step = 1;
    }
    if (step < 0) {
        dir = -1;
    }
    var res = [];
    for (var i = 0, cur = start; dir * cur < dir * end; i++, cur += step) {
        res[i] = cur;
    }
    return res;
}
exports.arrayRange = arrayRange;
function arraySum(arr, keyOpt) {
    var s = 0;
    for (var i = arr.length - 1; i >= 0; i--) {
        var v = void 0;
        if (arr[i] && typeof (arr[i]) === 'object' && keyOpt) {
            v = arr[i][keyOpt];
        }
        else {
            v = arr[i];
        }
        s += (v || 0);
    }
    return s;
}
exports.arraySum = arraySum;
function arrayMinMaxHelper(arr, isMax) {
    var s = undefined;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var v = arr_1[_i];
        if (isNaN(v)) {
            continue;
        }
        else if (s === undefined || (isMax ? s < v : s > v)) {
            s = v;
        }
    }
    return s;
}
function arrayMinMaxObjHelper(arr, key, isMax) {
    var s = undefined;
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var o = arr_2[_i];
        var v = o[key];
        if (isNaN(v)) {
            continue;
        }
        if (s === undefined || (isMax ? s < v : s > v)) {
            s = v;
        }
    }
    return s;
}
function arrayMax(arr) {
    return arrayMinMaxHelper(arr, true);
}
exports.arrayMax = arrayMax;
function arrayMaxObj(arr, key) {
    return arrayMinMaxObjHelper(arr, key, true);
}
exports.arrayMaxObj = arrayMaxObj;
function arrayMin(arr) {
    return arrayMinMaxHelper(arr, false);
}
exports.arrayMin = arrayMin;
function arrayMinObj(arr, key) {
    return arrayMinMaxObjHelper(arr, key, false);
}
exports.arrayMinObj = arrayMinObj;
function arrayPull(arrOfObjs, key) {
    var res = [];
    for (var i = 0; i < arrOfObjs.length; i++) {
        var obj = arrOfObjs[i];
        // typeof null is 'object'!
        if (typeof (obj) !== 'object' || obj === null) {
            res.push(undefined);
        }
        else {
            res.push(obj[key]);
        }
    }
    return res;
}
exports.arrayPull = arrayPull;
function stringArrayMergeUnique(a, b) {
    var uniq = {};
    for (var i = 0; i < a.length; ++i) {
        uniq[a[i]] = 1;
    }
    for (var i = 0; i < b.length; ++i) {
        uniq[b[i]] = 1;
    }
    return Object.keys(uniq);
}
exports.stringArrayMergeUnique = stringArrayMergeUnique;
function cmpString(desc, a, b) {
    var val = 0;
    if (a > b) {
        val = 1;
    }
    else if (b > a) {
        val = -1;
    }
    return (desc ? -val : val);
}
exports.cmpString = cmpString;
function cmpStringOrUndefined(undefFirst, desc, caseSensitive, a, b) {
    if (a === undefined) {
        if (b === undefined) {
            return 0;
        }
        return undefFirst === desc ? 1 : -1;
    }
    else if (b === undefined) {
        return undefFirst === desc ? -1 : 1;
    }
    if (!caseSensitive) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    return cmpString(desc, a, b);
}
exports.cmpStringOrUndefined = cmpStringOrUndefined;
function cmpNum(desc, a, b) {
    return (desc ? (b - a) : (a - b));
}
exports.cmpNum = cmpNum;
function forceArray(thing, shallowCln) {
    if (shallowCln === void 0) { shallowCln = false; }
    if (Array.isArray(thing)) {
        if (shallowCln) {
            var ret = [];
            for (var i = 0; i < thing.length; ++i) {
                ret.push(thing[i]);
            }
            return ret;
        }
        return thing;
    }
    else if (thing === undefined || thing === null) {
        return [];
    }
    else {
        return [thing];
    }
}
exports.forceArray = forceArray;
// Len is optional for arrays, required for array-like-objects.
function bsearch(arr, cmp, len) {
    var mn = 0;
    var mx = len || arr.length;
    var i;
    var res = -1;
    while (mn < mx) {
        i = (mx + mn) / 2 | 0;
        var op = cmp(arr[i]);
        if (op < 0) {
            mx = i;
        }
        else if (op > 0) {
            mn = i + 1;
        }
        else {
            res = i;
            break;
        }
    }
    return res;
}
exports.bsearch = bsearch;
