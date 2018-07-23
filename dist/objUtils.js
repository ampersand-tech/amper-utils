"use strict";
/**
* Copyright 2018-present Ampersand Technologies, Inc.
* @allowConsoleFuncs
*/
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(value) {
    return typeof (value) === 'object' && value !== null && !Array.isArray(value);
}
exports.isObject = isObject;
function fieldCount(obj) {
    var count = 1; // count ourselves
    if (typeof obj === 'object' && obj !== null) {
        // Count our children
        for (var key in obj) {
            count += fieldCount(obj[key]);
        }
    }
    return count;
}
exports.fieldCount = fieldCount;
function shallowClone(src) {
    var dst = {};
    for (var key in src) {
        dst[key] = src[key];
    }
    return dst;
}
exports.shallowClone = shallowClone;
function shallowCloneExcludeFields(src, toExclude) {
    var dst = shallowClone(src);
    for (var _i = 0, toExclude_1 = toExclude; _i < toExclude_1.length; _i++) {
        var field = toExclude_1[_i];
        delete dst[field];
    }
    return dst;
}
exports.shallowCloneExcludeFields = shallowCloneExcludeFields;
/**
 * Shallow clone, then copy fields.
 * @param src The object to clone.
 * @param replace The object to merge into src
 */
function shallowCloneAndCopy(src, replace) {
    var dst = shallowClone(src);
    copyFields(replace, dst);
    return dst;
}
exports.shallowCloneAndCopy = shallowCloneAndCopy;
function cloneTruncate(srcObj, maxBytes) {
    var noted = false;
    var endNote = '...';
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
            }
            else {
                maxBytes -= 5;
            }
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        var copy;
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0; i < obj.length; i++) {
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
        for (var id in obj) {
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
exports.cloneTruncate = cloneTruncate;
function cloneRecur(obj, depth) {
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
    var copy;
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0; i < obj.length; i++) {
            copy[i] = cloneRecur(obj[i], depth);
        }
        return copy;
    }
    copy = {};
    for (var id in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, id)) { // removing this check would give 50% speed improvement
            copy[id] = cloneRecur(obj[id], depth);
        }
    }
    return copy;
}
exports.cloneRecur = cloneRecur;
function clone(srcObj) {
    // early out for uncloneable values
    if ('object' !== typeof srcObj || null === srcObj) {
        return srcObj;
    }
    var ret;
    try {
        ret = cloneRecur(srcObj, 0);
    }
    catch (e) {
        if (e === 1) {
            console.error('Util.clone srcObj has depth > 100', { e: e, obj: cloneWithCycle(srcObj, true) });
            return cloneWithCycle(srcObj);
        }
        else {
            console.error('Util.clone error', { e: e, srcObj: srcObj });
        }
    }
    return ret;
}
exports.clone = clone;
// useful for cloning things that don't have just plain data
function cloneExcludingFields(srcObj, excludeFields) {
    if (srcObj === null || srcObj === undefined || typeof (srcObj) !== 'object') {
        return srcObj;
    }
    var res = Array.isArray(srcObj) ? [] : {};
    for (var k in srcObj) {
        if (excludeFields) {
            if (excludeFields === '*' || (excludeFields !== 1 && excludeFields[k] && !isObject(excludeFields[k]))) {
                continue;
            }
        }
        var exclude = void 0;
        if (excludeFields && typeof (excludeFields) === 'object') {
            exclude = excludeFields[k];
        }
        res[k] = cloneExcludingFields(srcObj[k], exclude);
    }
    return res;
}
exports.cloneExcludingFields = cloneExcludingFields;
function cloneWithCycle(rootObj, pruneCycles) {
    return cloneRec(rootObj, [], []);
    function cloneRec(obj, seenObjs, seenValues) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null === obj || 'object' !== typeof obj) {
            return obj;
        }
        var existingIdx = seenObjs.indexOf(obj);
        if (existingIdx >= 0) {
            if (pruneCycles) {
                return '<link cycle>';
            }
            else {
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
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = cloneRec(obj[i], seenObjs, seenValues);
            }
            return copy;
        }
        // Handle Object
        copy = {};
        seenObjs.push(obj);
        seenValues.push(copy);
        for (var attr in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                try {
                    copy[attr] = cloneRec(obj[attr], seenObjs, seenValues);
                }
                catch (ex) {
                    copy[attr] = '<caught exception>';
                }
            }
        }
        return copy;
    }
}
exports.cloneWithCycle = cloneWithCycle;
function cloneImmutable(obj) {
    var copy = clone(obj);
    return objectMakeImmutable(copy);
}
exports.cloneImmutable = cloneImmutable;
function objectMakeImmutable(obj, excludeFields) {
    if (null === obj || 'object' !== typeof obj) {
        return obj;
    }
    Object.freeze(obj);
    for (var k in obj) {
        var exclude = excludeFields && excludeFields[k];
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
exports.objectMakeImmutable = objectMakeImmutable;
function isImmutable(obj) {
    if (typeof (obj) !== 'object') {
        return true;
    }
    if (!Object.isFrozen(obj)) {
        return false;
    }
    for (var k in obj) {
        var o = obj[k];
        if (!isImmutable(o)) {
            return false;
        }
    }
    return true;
}
exports.isImmutable = isImmutable;
function deepCompare(x, y) {
    if (x === y) {
        return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }
    for (var p in x) {
        if (!deepCompare(x[p], y[p])) {
            return false;
        }
    }
    for (var p in y) {
        if (!(x.hasOwnProperty(p))) {
            return false;
        }
    }
    return true;
}
exports.deepCompare = deepCompare;
// NOTE: return type has Partial to encourage users of this to type their masks.
function cloneSomeFieldsImmutable(obj, mask, defaults) {
    var copy;
    var i;
    if (defaults !== undefined && (obj === null || obj === undefined)) {
        obj = defaults;
    }
    // Handle the 3 simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (!mask || mask === '*') {
        return cloneImmutable(obj);
    }
    if (mask === 1) {
        return {};
    }
    var submask = mask._ids; // not great type safety here
    if (submask) {
        if (obj instanceof Array) {
            copy = [];
            for (i = 0; i < obj.length; i++) {
                if (submask instanceof Object) {
                    copy.push(cloneSomeFieldsImmutable(obj[i], submask, defaults && defaults._ids));
                }
                else {
                    copy.push(i);
                }
            }
        }
        else if (obj instanceof Object) {
            copy = {};
            for (var id in obj) {
                if (submask instanceof Object) {
                    copy[id] = cloneSomeFieldsImmutable(obj[id], submask, defaults && defaults._ids);
                }
                else {
                    copy[id] = 1;
                }
            }
        }
    }
    else if (typeof (mask) === 'object') {
        copy = {};
        for (var key in mask) {
            var maskVal = mask[key];
            var objVal = void 0;
            if (!obj.hasOwnProperty(key) && (!defaults || !defaults.hasOwnProperty(key))) {
                // key is in the mask but not in the object or the defaults, so leave it out of the copy object
                continue;
            }
            if (obj[key] === undefined) {
                objVal = defaults && clone(defaults[key]);
            }
            else {
                objVal = obj[key];
            }
            if (typeof (maskVal) === 'object') {
                if (objVal instanceof Object) {
                    copy[key] = cloneSomeFieldsImmutable(objVal, maskVal, defaults && defaults[key]);
                }
                else if (objVal instanceof Array) {
                    copy[key] = [];
                    for (i = 0; i < objVal.length; i++) {
                        var dk = (defaults && defaults[key]);
                        copy[key].push(cloneSomeFieldsImmutable(objVal[i], maskVal, dk && dk[i]));
                    }
                }
                else if (objVal instanceof Date) {
                    copy[key] = new Date();
                    copy[key].setTime(objVal.getTime());
                }
                else {
                    copy[key] = objVal;
                }
            }
            else if (maskVal === '*') {
                if (objVal instanceof Date) {
                    copy[key] = new Date();
                    copy[key].setTime(objVal.getTime());
                }
                else if (objVal instanceof Array) {
                    copy[key] = cloneImmutable(objVal);
                }
                else if (objVal instanceof Function) {
                    copy[key] = objVal;
                }
                else if (objVal instanceof Object) {
                    copy[key] = cloneImmutable(objVal);
                }
                else {
                    copy[key] = objVal;
                }
            }
            else {
                if (objVal instanceof Date) {
                    copy[key] = new Date();
                    copy[key].setTime(objVal.getTime());
                }
                else if (objVal instanceof Array) {
                    copy[key] = objVal.length;
                }
                else if (objVal instanceof Function) {
                    copy[key] = objVal;
                }
                else if (objVal instanceof Object) {
                    copy[key] = {};
                }
                else {
                    copy[key] = objVal;
                }
            }
        }
    }
    else {
        console.error('cloneSomeFieldsImmutable.invalidMask', { mask: mask });
    }
    return Object.freeze(copy);
}
exports.cloneSomeFieldsImmutable = cloneSomeFieldsImmutable;
/**
 * Copy properties from src into dst
 */
function copyFields(src, dst) {
    for (var key in src) {
        dst[key] = src[key];
    }
    return dst;
}
exports.copyFields = copyFields;
function copyFieldsErrIfSet(src, dst) {
    var dupes = objIntersectionKeys(src, dst);
    if (dupes.length) {
        console.error('copyFieldsErrIfSet.existing keys', dupes);
        return;
    }
    copyFields(src, dst);
    return dst;
}
exports.copyFieldsErrIfSet = copyFieldsErrIfSet;
function copyFieldsIfUnset(src, dst) {
    for (var key in src) {
        if (!dst.hasOwnProperty(key)) {
            dst[key] = src[key];
        }
    }
    return dst;
}
exports.copyFieldsIfUnset = copyFieldsIfUnset;
/**
 * Copy a subset of the fields of src into dst and return dst.
 */
function copySomeFields(src, dst, fields) {
    dst = dst || {};
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var key = fields_1[_i];
        if (src[key] !== undefined) {
            dst[key] = src[key];
        }
    }
    return dst;
}
exports.copySomeFields = copySomeFields;
function cloneAndStrip(obj, fields) {
    var objCopy = clone(obj);
    for (var i = 0; i < fields.length; i++) {
        delete objCopy[fields[i]];
    }
    return objCopy;
}
exports.cloneAndStrip = cloneAndStrip;
// remove empty subobjects
function objectTrim(obj) {
    for (var k in obj) {
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
exports.objectTrim = objectTrim;
// Add all numbers in src to dst, creating the key if necessary
function objectSum(dst, src) {
    for (var key in src) {
        if (dst.hasOwnProperty(key)) {
            if (typeof dst[key] === 'object') {
                objectSum(dst[key], src[key]);
            }
            else {
                dst[key] += src[key];
            }
        }
        else {
            dst[key] = clone(src[key]);
        }
    }
}
exports.objectSum = objectSum;
function objIntersectionKeys(lhs, rhs) {
    var k;
    var res = [];
    for (k in lhs) {
        if (k in rhs) {
            res.push(k);
        }
    }
    return res;
}
exports.objIntersectionKeys = objIntersectionKeys;
function objFindRHSOnlyKeys(lhs, rhs) {
    var lhsMissing = [];
    for (var k in rhs) {
        if (k in lhs) {
            continue;
        }
        lhsMissing.push(k);
    }
    return lhsMissing;
}
exports.objFindRHSOnlyKeys = objFindRHSOnlyKeys;
function objDiffKeys(lhs, rhs) {
    return objFindRHSOnlyKeys(lhs, rhs).concat(objFindRHSOnlyKeys(rhs, lhs));
}
exports.objDiffKeys = objDiffKeys;
// Return the values in an object as an array
function objectValues(obj) {
    var a = [];
    for (var idx in obj) {
        if (!obj.hasOwnProperty(idx)) {
            continue;
        }
        a.push(obj[idx]);
    }
    return a;
}
exports.objectValues = objectValues;
function objectMap(obj, cb) {
    var res = {};
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        res[key] = cb(obj[key], key);
    }
    return res;
}
exports.objectMap = objectMap;
function objectFilter(obj, filter) {
    if (!obj) {
        return;
    }
    var res = {};
    for (var k in obj) {
        var v = obj[k];
        if (!filter && (v === null || v === undefined)) {
            continue;
        }
        else if (filter && !filter(v, k)) {
            continue;
        }
        res[k] = v;
    }
    return res;
}
exports.objectFilter = objectFilter;
/**
 * only checks keys directly on the object.
 */
function objectKeysEqual(obj1, obj2) {
    var keys1 = Object.keys(obj1);
    if (keys1.length !== Object.keys(obj2).length) {
        return false;
    }
    for (var i = 0; i < keys1.length; ++i) {
        var k = keys1[i];
        if (!obj2.hasOwnProperty(k)) {
            return false;
        }
    }
    return true;
}
exports.objectKeysEqual = objectKeysEqual;
function objectSortKeys(obj, cmp) {
    if (!obj) {
        return obj;
    }
    var keys = Object.keys(obj);
    if (keys.length <= 1) {
        return obj;
    }
    keys = keys.sort(cmp);
    var out = {};
    for (var i = 0; i < keys.length; ++i) {
        out[keys[i]] = obj[keys[i]];
    }
    return out;
}
exports.objectSortKeys = objectSortKeys;
function objSwapValues(a, b, keys) {
    for (var i = 0; i < keys.length; ++i) {
        var k = keys[i];
        var tmp = a[k];
        a[k] = b[k];
        b[k] = tmp;
    }
}
exports.objSwapValues = objSwapValues;
function safeObjIsEmpty(obj) {
    if (!obj) {
        return true;
    }
    for (var _x in obj) {
        return false;
    }
    return true;
}
exports.safeObjIsEmpty = safeObjIsEmpty;
// {foo: {bar: {baz: 1}}} with ['foo','bar','baz'] => 1
function objectGetFromPath(obj, names) {
    if (!obj || !Array.isArray(names)) {
        return;
    }
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (!obj || typeof obj !== 'object') {
            return;
        }
        obj = obj[name];
    }
    return obj;
}
exports.objectGetFromPath = objectGetFromPath;
function objectFillPath(obj, path, value) {
    if (!obj || !path || value === undefined) {
        console.error('objectFillPath invalid call', { obj: obj, path: path });
        return;
    }
    for (var i = 0; i < path.length - 1; ++i) {
        var name = path[i];
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
    }
    else {
        return undefined;
    }
    return obj;
}
exports.objectFillPath = objectFillPath;
function objIncrementKey(obj, key) {
    if (!obj[key]) {
        obj[key] = 1;
    }
    else {
        obj[key]++;
    }
    return obj[key];
}
exports.objIncrementKey = objIncrementKey;
function objClear(obj) {
    if (Array.isArray(obj)) {
        obj.splice(0, obj.length);
        return obj;
    }
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            delete obj[k];
        }
    }
    return obj;
}
exports.objClear = objClear;
function objDiffRecur(path, diffs, ignoreMask, src, dst) {
    if (src === dst) {
        return diffs;
    }
    if (src === null || src === undefined || dst === null || dst === undefined) {
        diffs.push({ path: path, src: (src === undefined ? 'undefined' : src), dst: (dst === undefined ? 'undefined' : dst) });
    }
    else if (typeof src === 'object') {
        var id = void 0, visited = {};
        var maskVal = void 0;
        for (id in src) {
            maskVal = ignoreMask[id] || ignoreMask._ids || {};
            if (maskVal && typeof (maskVal) !== 'object') {
                continue;
            }
            var newPath = path + '.' + id;
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
            if (maskVal && typeof (maskVal) !== 'object') {
                continue;
            }
            objDiffRecur(path + '.' + id, diffs, maskVal, src[id], dst[id]);
        }
    }
    else {
        diffs.push({ path: path, src: src, dst: dst });
    }
    return diffs;
}
exports.objDiffRecur = objDiffRecur;
function objDiff(src, dst, ignoreMask) {
    return objDiffRecur('root', [], ignoreMask || {}, src, dst);
}
exports.objDiff = objDiff;
function objCmpMasked(src, dst, ignoreMask) {
    return objDiff(src, dst, ignoreMask).length === 0;
}
exports.objCmpMasked = objCmpMasked;
function objToArray(obj, sortOpt) {
    var res = [];
    if (obj) {
        for (var k in obj) {
            var o = obj[k];
            res.push(o);
        }
        if (sortOpt) {
            res.sort(sortOpt);
        }
    }
    return res;
}
exports.objToArray = objToArray;
// only returns true or false, true means they are the same
// supports objects, strings, numbers, arrays, even functions (pointers)
function objCmpFast(src, dst) {
    try {
        return objCmpFastInternal(src, dst, 0);
    }
    catch (e) {
        if (e === 'obj_too_deep') {
            console.error('objCmpFast object too deep, or circular');
        }
        else {
            console.error('objCmpFast caught exception', e);
        }
    }
    return false;
}
exports.objCmpFast = objCmpFast;
function objCmpFastInternal(src, dst, recurDepth) {
    // check plain old types
    if (typeof (src) !== 'object' || typeof (dst) !== 'object' || src === null || dst === null) {
        return src === dst;
    }
    var sKeys = Object.keys(src);
    var dKeys = Object.keys(dst);
    if (sKeys.length !== dKeys.length) {
        return false; // Different number of keys
    }
    if (recurDepth > 20) {
        throw 'obj_too_deep';
    }
    recurDepth++;
    for (var i = 0; i < sKeys.length; ++i) {
        var s = src[sKeys[i]];
        var d = dst[sKeys[i]];
        if (!objCmpFastInternal(s, d, recurDepth)) {
            return false;
        }
    }
    return true;
}
