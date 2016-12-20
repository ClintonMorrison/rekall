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

describe('util#suffixesOf', function () {
  it('should return an empty array for an empty string', function () {
    var suffixes = util.suffixesOf('');
    suffixes.should.be.instanceOf(Array);
    suffixes.length.should.be.exactly(0);
  });
  
  it('should return the suffxies in lexicographically ascending order', function () {
    var suffixes = util.suffixesOf('abcd');
    suffixes.should.be.instanceOf(Array);
    suffixes[0].should.be.exactly('abcd');
    suffixes[1].should.be.exactly('bcd');
    suffixes[2].should.be.exactly('cd');
    suffixes[3].should.be.exactly('d');
    suffixes.length.should.be.exactly(4);
    
    suffixes = util.suffixesOf('dbca');
    suffixes.should.be.instanceOf(Array);
    suffixes[0].should.be.exactly('a');
    suffixes[1].should.be.exactly('bca');
    suffixes[2].should.be.exactly('ca');
    suffixes[3].should.be.exactly('dbca');
    suffixes.length.should.be.exactly(4);
  });

});
