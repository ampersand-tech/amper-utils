/**
* Copyright 2018-present Ampersand Technologies, Inc.
*
* @allowConsoleFuncs
*/
export declare function stringRepeat(s: string, n: number): string;
export declare function toFixedLength(n: number, len: number, radix?: number): string;
export declare function findWordStart(s: any, idx: any): number | undefined;
export declare function findWordEnd(s: any, idx: any): any;
export declare function startsWith(str: string, prefix: string): boolean;
export declare function endsWith(str: string, ext: string): boolean;
export declare function fileName(filename: string): string;
export declare function fileExt(filename: string): string;
export declare function nameOwnership(name: string): string;
/**
 * Convert a "camelCased" string to a title-cased string.
 * @example titlify("lastModifiedTimeStr") === "Last Modified Time Str"
 */
export declare function titlify(s: string): string;
export declare function formatNameList(names: string[]): string;
export declare function pluralize(noun: string, count: number): string;
export declare function deMultiByte(string: string): string;
export declare function checkForNonPrintableUnicode(str: string): string;
export declare function safeEncodeURIComponent(uriStr: string): string | undefined;
export declare function safeDecodeURIComponent(uriStr: string): string | undefined;
