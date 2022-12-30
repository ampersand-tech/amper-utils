/**
* Copyright 2015-present Ampersand Technologies, Inc.
*/

import { getFunctionParamNames } from '../lib/functionUtils';

import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('functionUtils', function() {
  function syncFunc(a, b, c, d) {
    a = b + c + d;
    return a;
  }
  function syncFunc2(a, bIgnored, c, d) {
    a = bIgnored + c + d;
    return a;
  }
  const fatArrowA = a => a;
  const fatArrowB = b => b();

  it('should get function params properly with getFunctionParamNames', function() {
    expect(getFunctionParamNames(syncFunc)).to.deep.equal(['a', 'b', 'c', 'd']);
    expect(getFunctionParamNames(syncFunc2)).to.deep.equal(['a', 'b', 'c', 'd']);
    expect(getFunctionParamNames((_a, _b, _c = false, _d?: number) => 0)).to.deep.equal(['a', 'b', 'c', 'd']);
    expect(getFunctionParamNames(fatArrowA)).to.deep.equal(['a']);
    expect(getFunctionParamNames(fatArrowB)).to.deep.equal(['b']);
  });
});
