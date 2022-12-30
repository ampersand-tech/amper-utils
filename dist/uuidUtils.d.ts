/**
* Copyright 2018-present Ampersand Technologies, Inc.
*
*/
export declare function randInt(): number;
export type Alphabet = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'j' | 'k' | 'm' | 'n' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'J' | 'K' | 'M' | 'N' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export declare function numberToLetter(val: any): Alphabet;
export declare function numberToID(val: number): string;
export declare function idToNumber(str: string): number;
export declare function createUUID(accountID: string, sessionIdx: number, optType?: string): {
    uuid: string;
    count: number;
};
export declare function canMakeUUID(accountID: string, sessionIdx: number): boolean;
export declare function parseUUID(uuid: string): {
    accountID: string;
    sessionID: number;
    windowNumber: number;
    count: number;
    optType: string;
} | undefined;
export declare function timeKeyFromDate(t: number): string;
export declare function timeKey(): string;
export declare function setWindowNumber(countStr: string): void;
export declare function setSessionIdx(sessionIdx: number): void;
export declare function setUUIDCounter(count: number | null): void;
export declare const test: {
    setTimeKeyCount: (count: number) => void;
};
