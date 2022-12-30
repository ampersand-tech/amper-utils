/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/

import * as StringUtils from '../lib//stringUtils';

import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('stringUtils', function() {
  describe('titlify', function() {
    it('should work', function() {
      expect(StringUtils.titlify('someCamelCaseWord')).to.equal('Some Camel Case Word');
      expect(StringUtils.titlify('Custom Label')).to.equal('Custom Label');
    });
  });

  describe('formatNameList', function() {
    it('should work', function() {
      expect(StringUtils.formatNameList(['alice'])).to.equal('alice');
      expect(StringUtils.formatNameList(['alice', 'bob'])).to.equal('alice and bob');
      expect(StringUtils.formatNameList(['alice', 'bob', 'chuck'])).to.equal('alice, bob, and chuck');
      expect(StringUtils.formatNameList(['alice', 'bob', 'chuck', 'dan'])).to.equal('alice, bob, chuck, and dan');
    });
  });

  describe('findWordStart/findWordEnd', function() {
    it('should find whitespace before the passed index', function() {
      expect(StringUtils.findWordStart('foo', 1)).to.equal(0);
      expect(StringUtils.findWordStart('', 0)).to.equal(0);
      expect(StringUtils.findWordStart('  ', 1)).to.equal(1);
      expect(StringUtils.findWordStart(' foo bar ', 1)).to.equal(1);
      expect(StringUtils.findWordStart(' foo bar ', 4)).to.equal(1);
      expect(StringUtils.findWordStart(' foo ', 5)).to.equal(5); // if idx has ws before, return idx
      expect(StringUtils.findWordStart('foo', 1)).to.equal(0);
      expect(StringUtils.findWordStart(' foo bar ', 5)).to.equal(5);
      expect(StringUtils.findWordStart(' foo bar ', 8)).to.equal(5);
      expect(StringUtils.findWordStart(' foo     bar   ', 12)).to.equal(9); // skips multiple ws
      // matches newlines as whitespace, counts non alpha characters
      expect(StringUtils.findWordStart(' 1t\'s@"w0\nde\r\tfulword"!', 9)).to.equal(1);
      expect(StringUtils.findWordStart(' 1t\'s@"w0\nde\r\tfulword"!', 12)).to.equal(10);
      expect(StringUtils.findWordStart(' 1t\'s@"w0\nde\r\tfulword"!', 21)).to.equal(14);
    });
    it('should find whitespace after the passed index', function() {
      expect(StringUtils.findWordEnd('foo', 1)).to.equal(3);
      expect(StringUtils.findWordEnd('', 0)).to.equal(0);
      expect(StringUtils.findWordEnd('  ', 1)).to.equal(1);
      expect(StringUtils.findWordEnd(' foo bar ', 1)).to.equal(4);
      expect(StringUtils.findWordEnd(' foo bar ', 4)).to.equal(4);
      expect(StringUtils.findWordEnd('foo', 1)).to.equal(3);
      expect(StringUtils.findWordEnd(' foo bar ', 5)).to.equal(8);
      expect(StringUtils.findWordEnd(' foo bar ', 8)).to.equal(8);
      expect(StringUtils.findWordEnd(' foo     bar   ', 12)).to.equal(12);
      // matches newlines as whitespace, counts non alpha characters
      expect(StringUtils.findWordEnd(' 1t\'s@"w0\nde\r\tfulword"!', 1)).to.equal(9);
      expect(StringUtils.findWordEnd(' 1t\'s@"w0\nde\r\tfulword"!', 10)).to.equal(12);
      expect(StringUtils.findWordEnd(' 1t\'s@"w0\nde\r\tfulword"!', 14)).to.equal(23);
    });
  });
});
