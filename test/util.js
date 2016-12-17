'use strict';
var util = require('../lib/util');

describe('util#startsWith', function () {
  it('should return a boolean', function () {
	  util.startsWith('ABCD', 'A').should.be.a.instanceOf(Boolean);
    util.startsWith('ABCD', 'E').should.be.a.instanceOf(Boolean);
  });

  it('should return true if str1 starts with str2', function () {
    util.startsWith('ABCD', 'A').should.be.true();
    util.startsWith('A', 'A').should.be.true();
  });

  it('should return false if str1 does not start with str2', function () {
    util.startsWith('ABCD', 'E').should.be.false();
    util.startsWith('', 'A').should.be.false();
    util.startsWith('ABC', 'ABCD').should.be.false();
  });
});
