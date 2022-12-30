/**
* Copyright 2015-present Ampersand Technologies, Inc.
*/

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;
const DEFAULT_ARG_VALUE = /\s*=\s*[a-z0-9']+/g;

export type AnyFunc = (...params: any[]) => any;

export function getFunctionParamNames(func: AnyFunc): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  const firstParen = fnStr.indexOf('(');
  const firstFatArrow = fnStr.indexOf('=>');
  let argsStr: string;
  if (firstFatArrow >= 0 && (firstParen < 0 || firstFatArrow < firstParen)) {
    // likely dropped the parentheses around the fat arrow params
    argsStr = fnStr.slice(0, firstFatArrow - 1);
  } else {
    argsStr = fnStr.slice(firstParen + 1, fnStr.indexOf(')'));
  }
  let args = argsStr.replace(DEFAULT_ARG_VALUE, '='); // strip any default values. will not work for objects
  const tmp = args.match(ARGUMENT_NAMES) ?? [];

  // function.length is only accurate up to the first default value for an argument
  // so just count up to that and hope the rest is accurate
  let len = 0;
  for (const res of tmp) {
    if (res.indexOf('=') >= 0) {
      break;
    }
    len++;
  }
  if (len !== func.length) {
    // probably a bound or variadic function
    return [];
  }
  // this time replace the default args with nothing
  args = argsStr.replace(DEFAULT_ARG_VALUE, ''); // strip any default values. will not work for objects
  const names = args.match(ARGUMENT_NAMES) || [];
  return names.map(function(name) {
    if (name[0] === '_') {
      return name.slice(1);
    }
    if (name.length > 7 && name.slice(-7) === 'Ignored') {
      return name.slice(0, -7);
    }
    return name;
  });
}
