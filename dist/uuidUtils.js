"use strict";
/**
* Copyright 2018-present Ampersand Technologies, Inc.
*
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.setUUIDCounter = exports.setSessionIdx = exports.setWindowNumber = exports.timeKey = exports.timeKeyFromDate = exports.parseUUID = exports.canMakeUUID = exports.createUUID = exports.idToNumber = exports.numberToID = exports.numberToLetter = exports.randInt = void 0;
const StringUtils = require("./stringUtils");
function randInt() {
    return (Math.random() * (1 << 24)) | 0;
}
exports.randInt = randInt;
const alphabet = '0123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ'; // never change this is or it will break account creation
function numberToLetter(val) {
    return alphabet[val % alphabet.length];
}
exports.numberToLetter = numberToLetter;
function numberToID(val) {
    val |= 0;
    let str = '';
    while (val) {
        str = numberToLetter(val) + str;
        val = (val / alphabet.length) | 0;
    }
    return str;
}
exports.numberToID = numberToID;
function idToNumber(str) {
    let val = 0;
    for (let i = 0; i < str.length; i++) {
        if (i) {
            val *= alphabet.length;
        }
        val += alphabet.indexOf(str[i]);
    }
    return val;
}
exports.idToNumber = idToNumber;
let gUUIDCounter = null;
let gWindowNumber = 0;
function createUUID(accountID, sessionIdx, optType) {
    if (gUUIDCounter === null) {
        gUUIDCounter = randInt();
        console.error('UUIDCounter not inited', gUUIDCounter);
    }
    if (optType && !/^\w+$/.exec(optType)) {
        throw new Error('createUUID invalid optType ' + optType);
    }
    if (!sessionIdx) {
        throw new Error('createUUID invalid sessionID ' + sessionIdx);
    }
    const sessionID = numberToID(sessionIdx) + '+' + numberToID(gWindowNumber || 1);
    const count = ++gUUIDCounter;
    return {
        uuid: accountID + '_' + sessionID + '_' + count + (optType ? '-' + optType : ''),
        count: count,
    };
}
exports.createUUID = createUUID;
function canMakeUUID(accountID, sessionIdx) {
    return Boolean(accountID && sessionIdx && gUUIDCounter !== null);
}
exports.canMakeUUID = canMakeUUID;
function parseUUID(uuid) {
    // see dbUtil.uuid()
    const m = (/(.*?)_(.*?)_([0-9]+)(?:-(.*))?/).exec(uuid);
    if (!m) {
        return;
    }
    const sessionParts = m[2].split('+');
    const sessionID = idToNumber(sessionParts[0]);
    if (!sessionID) {
        return;
    }
    const windowNumber = sessionParts[1] ? idToNumber(sessionParts[1]) : undefined;
    const count = parseInt(m[3], 10) | 0;
    if (count) {
        return {
            accountID: m[1],
            sessionID: sessionID,
            windowNumber: windowNumber,
            count: count,
            optType: m[4],
        };
    }
}
exports.parseUUID = parseUUID;
let gPrevTime = 0;
let gCount = 0;
let gSessionIdx = 0;
function timeKeyFromDate(t) {
    if (t === gPrevTime) {
        gCount++;
        if (gCount > 9999) {
            throw ('> 10000 inserts in one millisecond');
        }
    }
    else {
        gPrevTime = t;
        gCount = 0;
    }
    let key = StringUtils.toFixedLength(t, 14) + '.' + StringUtils.toFixedLength(gCount, 4) + '.' + StringUtils.toFixedLength(gSessionIdx, 5);
    if (gWindowNumber) {
        key += '.' + StringUtils.toFixedLength(gWindowNumber, 2);
    }
    return key;
}
exports.timeKeyFromDate = timeKeyFromDate;
function timeKey() {
    return timeKeyFromDate(Date.now());
}
exports.timeKey = timeKey;
function setWindowNumber(countStr) {
    gWindowNumber = parseInt(countStr) || 0;
}
exports.setWindowNumber = setWindowNumber;
function setSessionIdx(sessionIdx) {
    gSessionIdx = sessionIdx || 0;
}
exports.setSessionIdx = setSessionIdx;
function setUUIDCounter(count) {
    gUUIDCounter = count;
}
exports.setUUIDCounter = setUUIDCounter;
exports.test = {
    setTimeKeyCount: (count) => {
        gCount = count;
    },
};
