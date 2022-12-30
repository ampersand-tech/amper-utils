/**
* Copyright 2018-present Ampersand Technologies, Inc.
*
*/

import * as StringUtils from './stringUtils';

export function randInt() {
  return (Math.random() * (1 << 24)) | 0;
}

const alphabet = '0123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ'; // never change this is or it will break account creation
export type Alphabet = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'j'|'k'|'m'|'n'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|
  'y'|'z'|'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'J'|'K'|'M'|'N'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z';

export function numberToLetter(val): Alphabet {
  return alphabet[val % alphabet.length] as Alphabet;
}

export function numberToID(val: number): string {
  val |= 0;
  let str = '';
  while (val) {
    str = numberToLetter(val) + str;
    val = (val / alphabet.length) | 0;
  }
  return str;
}

export function idToNumber(str: string): number {
  let val = 0;
  for (let i = 0; i < str.length; i++) {
    if (i) {
      val *= alphabet.length;
    }
    val += alphabet.indexOf(str[i]);
  }
  return val;
}

let gUUIDCounter: number | null = null;
let gWindowNumber = 0;

export function createUUID(accountID: string, sessionIdx: number, optType?: string) : {uuid: string, count: number} {
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

export function canMakeUUID(accountID: string, sessionIdx: number): boolean {
  return Boolean(accountID && sessionIdx && gUUIDCounter !== null);
}

export function parseUUID(uuid: string) {
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

let gPrevTime = 0;
let gCount = 0;
let gSessionIdx = 0;

export function timeKeyFromDate(t: number) {
  if (t === gPrevTime) {
    gCount++;
    if (gCount > 9999) {
      throw ('> 10000 inserts in one millisecond');
    }
  } else {
    gPrevTime = t;
    gCount = 0;
  }
  let key = StringUtils.toFixedLength(t, 14) + '.' + StringUtils.toFixedLength(gCount, 4) + '.' + StringUtils.toFixedLength(gSessionIdx, 5);
  if (gWindowNumber) {
    key += '.' + StringUtils.toFixedLength(gWindowNumber, 2);
  }
  return key;
}

export function timeKey() {
  return timeKeyFromDate(Date.now());
}

export function setWindowNumber(countStr: string) {
  gWindowNumber = parseInt(countStr) || 0;
}

export function setSessionIdx(sessionIdx: number) {
  gSessionIdx = sessionIdx || 0;
}

export function setUUIDCounter(count: number | null) {
  gUUIDCounter = count;
}


export const test = {
  setTimeKeyCount: (count: number) => {
    gCount = count;
  },
};
