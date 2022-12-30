/**
* Copyright 2018-present Ampersand Technologies, Inc.
*/

import { Stash } from '../lib/types';
import * as UuidUtils from '../lib/uuidUtils';

import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('numberToID', function() {
  it('should work', function() {
    const ids: Stash<number> = {};
    for (let i = 1; i < 40000; i++) {
      // make sure it is reversible
      const id = UuidUtils.numberToID(i);
      expect(id).to.be.a('string');
      expect(UuidUtils.idToNumber(id)).to.equal(i);

      // make sure there are no duplicates
      expect(ids).to.not.have.property(id);
      ids[id] = i;
    }
  });
});

describe('timeKey', function() {
  it('should generate timeKeys correctly', function() {
    let t = 1460059678537;
    UuidUtils.test.setTimeKeyCount(0);
    UuidUtils.setSessionIdx(4);
    expect(UuidUtils.timeKeyFromDate(t)).to.equal('01460059678537.0000.00004');
    expect(UuidUtils.timeKeyFromDate(t)).to.equal('01460059678537.0001.00004');
    expect(UuidUtils.timeKeyFromDate(t)).to.equal('01460059678537.0002.00004');
    t += 5;
    expect(UuidUtils.timeKeyFromDate(t)).to.equal('01460059678542.0000.00004');

    UuidUtils.setSessionIdx(10001);
    t += 5;
    expect(UuidUtils.timeKeyFromDate(t)).to.equal('01460059678547.0000.10001');

    UuidUtils.setSessionIdx(1000001);
    t += 5;
    expect(UuidUtils.timeKeyFromDate(t)).to.equal('01460059678552.0000.1000001');
  });
});

describe('uuid', function() {
  it('should create and parse properly', function() {
    UuidUtils.setUUIDCounter(0);
    expect(UuidUtils.createUUID('asdf', 1234, 'zxcv')).to.eql({uuid: 'asdf_p2+1_1-zxcv', count: 1});
    expect(UuidUtils.createUUID('asdf', 1234, 'zxcv')).to.eql({uuid: 'asdf_p2+1_2-zxcv', count: 2});
    UuidUtils.setUUIDCounter(0);
    expect(UuidUtils.createUUID('asdf', 1234, 'zxcv')).to.eql({uuid: 'asdf_p2+1_1-zxcv', count: 1});

    UuidUtils.setUUIDCounter(0);
    let uid = UuidUtils.createUUID('asdf', 1234, 'zxcv');
    expect(UuidUtils.parseUUID(uid && uid.uuid)).to.eql({accountID: 'asdf', sessionID: 1234, windowNumber: 1, count: 1, optType: 'zxcv'});
    expect(UuidUtils.parseUUID('1_2_1')).to.eql({accountID: '1', sessionID: 2, windowNumber: undefined, count: 1, optType: undefined});
    expect(UuidUtils.parseUUID('1_20+5_78')).to.eql({accountID: '1', sessionID: 112, windowNumber: 5, count: 78, optType: undefined});
    expect(UuidUtils.parseUUID('1_20+5_78-ck')).to.eql({accountID: '1', sessionID: 112, windowNumber: 5, count: 78, optType: 'ck'});
    expect(UuidUtils.parseUUID('')).to.not.exist;
    expect(UuidUtils.parseUUID('asdf_asdf')).to.not.exist;
    expect(UuidUtils.parseUUID('asdf__1234')).to.not.exist;
    expect(UuidUtils.parseUUID('asdf_1234_')).to.not.exist;
  });
});
