'use strict';

import sinon from 'sinon';
import ObjectQuery from '../src/ObjectQuery';

describe('ObjectQuery#execute', function () {
  it('should invoke the execute handler callback', function () {
    const callback = sinon.spy();
    const query = new ObjectQuery('ALL', callback);
    query.execute();
    callback.should.be.calledWith(query.clauses);
  });
});

describe('ObjectQuery#_validateAndPushIncompleteClause', function () {
  beforeEach(function () {
    this.query = new ObjectQuery('ALL', sinon.stub());
  });
  
  context('there is a completed clause', function () {
    beforeEach(function () {
      this.clause = {
        field: 'name',
        operation: 'equals',
        value: 'Clinton'
      };
      
      this.query.incompleteClause = this.clause;
    });
    
    it('appends the clause', function () {
      this.query._validateAndPushIncompleteClause();
      this.query.clauses.should.containEql(this.clause);
    });
    
    it('clears the incompleteClause', function () {
      this.query._validateAndPushIncompleteClause();
      this.query.incompleteClause.should.match({});
    });
  });
  
  context('there is an incomplete clause', function () {
    beforeEach(function () {
      this.clause = {
        field: 'name',
        operation: 'equals'
      };
      
      this.query.incompleteClause = this.clause;
    });
     
    it('does NOT append the clause', function () {
      this.query._validateAndPushIncompleteClause();
      this.query.clauses.should.not.containEql(this.clause);
    });
  });
});

/*
describe('augmentWithQueryBuilder', function () {
  it('should add a findAll property', function () {
    const object = {};
    augmentWithQueryBuilder(object, sinon.stub());
    
    object.findAll.should.be.instanceof(ObjectQuery);
    object.findAll.resultType.should.equal('ALL');
  });
  
  it('should add a findOne property', function () {
    const object = {};
    augmentWithQueryBuilder(object, sinon.stub());
    
    object.findOne.should.be.instanceof(ObjectQuery);
    object.findOne.resultType.should.equal('ONE');
  });
});

*/

