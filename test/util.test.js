'use strict';

import sinon from 'sinon';
import util from '../src/util';

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

describe('util#each', function () {
  it('should invoke the callback for each element of an array', function () {
    var callback = sinon.spy();
    util.each(['A', 'B', 'C', 'D'], callback);
    callback.should.have.callCount(4);
    callback.should.be.calledWith('A', 0);
    callback.should.be.calledWith('B', 1);
    callback.should.be.calledWith('C', 2);
    callback.should.be.calledWith('D', 3);
  });
  
  it('should invoke the callback for each key of an object', function () {
    var callback = sinon.spy();
    util.each({
      A: 1,
      B: 2,
      C: 3,
      D: 4
    }, callback);
    
    callback.should.have.callCount(4);
    callback.should.be.calledWith(1, 'A');
    callback.should.be.calledWith(2, 'B');
    callback.should.be.calledWith(3, 'C');
    callback.should.be.calledWith(4, 'D');
  });
  
  it('should invoke the callback for each character of a string', function () {
    var callback = sinon.spy();
    util.each('ABCD', callback);
    
    callback.should.have.callCount(4);
    callback.should.be.calledWith('A', 0);
    callback.should.be.calledWith('B', 1);
    callback.should.be.calledWith('C', 2);
    callback.should.be.calledWith('D', 3);
  });
  
  it('should not invoke the callback for empty objects', function () {
    var callback = sinon.spy();
    util.each({}, callback);
    callback.should.not.be.called();
    
    util.each([], callback);
    callback.should.not.be.called();
    
    util.each('', callback);
    callback.should.not.be.called();
    
    util.each(false, callback);
    callback.should.not.be.called();
  
    util.each(null, callback);
    callback.should.not.be.called();
  });
});

describe('util#hasKeys', function () {
  it('should return true if the object has all the required keys', function () {
    util.hasKeys({ a: 1, b: 2, c: 3}, ['a', 'c']).should.equal(true);
  });
  
  it('should return false if the object does NOT have all the required keys', function () {
    util.hasKeys({ a: 1, b: 2, c: 3}, ['a', 'd']).should.equal(false);
  });
});