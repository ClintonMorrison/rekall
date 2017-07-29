import should from 'should';
import StringIndex from '../src/StringIndex';

describe('StringIndex', function () {
  describe('#_encode', function () {
    it('should replace "$" with "\\$"', function () {
      StringIndex._encode('ABCD$ TEST$').should.be.exactly('ABCD\\$ TEST\\$');
    });

    it('should replace "^" with "\\^"', function () {
      StringIndex._encode('ABCD^ TEST^').should.be.exactly('ABCD\\^ TEST\\^');
    });
  });

  describe('#_decode', function () {
    it('should not change a string the does not have "^" and "$" characters', function () {
      StringIndex._decode('test').should.be.exactly('test');
    });

    it('should replace "\\^" with "^"', function () {
      StringIndex._decode('test\\^test').should.be.exactly('test^test');
    });

    it('should replace "\\$" with "$"', function () {
      StringIndex._decode('test\\$test').should.be.exactly('test$test');
    });
  });

  describe('#_getIDsWhereStringEquals', function () {
    beforeEach(function () {
      this.stringIndex = new StringIndex();
      this.stringIndex.add(1, 'abcd');
    });

    context('there is a query equal to an indexed string', function () {
      beforeEach(function () {
        this.query = 'abcd';
      });

      it('should return the id of the equal string', function () {
        this.stringIndex._getIDsWhereStringEquals(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a prefix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'ab';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringEquals(this.query).should.be.empty();
      });
    });

    context('there is a query that is a suffix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'cd';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringEquals(this.query).should.be.empty();
      });
    });

    context('there is a query that is a contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'cd';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringEquals(this.query).should.be.empty();
      });
    });
  });

  describe('#_getIDsWhereStringContains', function () {
    beforeEach(function () {
      this.stringIndex = new StringIndex();
      this.stringIndex.add(1, 'abcd');
    });

    context('there is a query equal to an indexed string', function () {
      beforeEach(function () {
        this.query = 'abcd';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringContains(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a prefix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'ab';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringContains(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a suffix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'cd';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringContains(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'bc';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringContains(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a is NOT contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'ac';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringContains(this.query).should.be.empty();
      });
    });
  });

  describe('#_getIDsWhereStringStartsWith', function () {
    beforeEach(function () {
      this.stringIndex = new StringIndex();
      this.stringIndex.add(1, 'abcd');
    });

    context('there is a query equal to an indexed string', function () {
      beforeEach(function () {
        this.query = 'abcd';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringStartsWith(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a prefix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'ab';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringStartsWith(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a suffix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'cd';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringStartsWith(this.query).should.be.empty();
      });
    });

    context('there is a query that is a contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'bc';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringStartsWith(this.query).should.be.empty();
      });
    });

    context('there is a query that is a is NOT contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'ac';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringStartsWith(this.query).should.be.empty();
      });
    });
  });

  describe('#_getIDsWhereStringEndsWith', function () {
    beforeEach(function () {
      this.stringIndex = new StringIndex();
      this.stringIndex.add(1, 'abcd');
    });

    context('there is a query equal to an indexed string', function () {
      beforeEach(function () {
        this.query = 'abcd';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringEndsWith(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a prefix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'ab';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringEndsWith(this.query).should.be.empty();
      });
    });

    context('there is a query that is a suffix of an indexed string', function () {
      beforeEach(function () {
        this.query = 'cd';
      });

      it('should return an array with the id of the indexed string', function () {
        this.stringIndex._getIDsWhereStringEndsWith(this.query).should.match(['1']);
      });
    });

    context('there is a query that is a contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'bc';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringEndsWith(this.query).should.be.empty();
      });
    });

    context('there is a query that is a is NOT contained by an indexed string', function () {
      beforeEach(function () {
        this.query = 'ac';
      });

      it('should return an empty array', function () {
        this.stringIndex._getIDsWhereStringEndsWith(this.query).should.be.empty();
      });
    });
  });

  describe('#findOne', function () {
    context('there are no matching indexed strings', function () {

      beforeEach(function () {
        this.stringIndex = new StringIndex();
        this.stringIndex.add(1, 'Cat');
        this.stringIndex.add(2, 'Dog');
        this.stringIndex.add(3, 'Bird');

        this.query = 'Elephant';
      });

      it('should return null', function () {
        const stringId = this.stringIndex.findOne.thatContains(this.query);
        should.not.exist(stringId);
      });
    });

    context('there are multiple matching indexed strings', function () {

      beforeEach(function () {
        this.stringIndex = new StringIndex();
        this.stringIndex.add(1, 'a');
        this.stringIndex.add(2, 'ba');
        this.stringIndex.add(3, 'de');
        this.stringIndex.add(4, 'ac');

        this.query = 'a';
      });

      it('should return the ID of the lexicographically smallest match', function () {
        const stringID = this.stringIndex.findOne.thatContains(this.query);
        stringID.should.equal('1');
      });
    });
  });

  describe('#findAll', function () {
    context('there are no matching indexed strings', function () {

      beforeEach(function () {
        this.stringIndex = new StringIndex();
        this.stringIndex.add(1, 'Cat');
        this.stringIndex.add(2, 'Dog');
        this.stringIndex.add(3, 'Bird');

        this.query = 'Elephant';
      });

      it('should return an empty array', function () {
        const stringIDs = this.stringIndex.findAll.thatContain(this.query);
        stringIDs.should.be.empty();
      });
    });

    context('there are multiple matching indexed strings', function () {

      beforeEach(function () {
        this.stringIndex = new StringIndex();
        this.stringIndex.add(1, 'a');
        this.stringIndex.add(2, 'ba');
        this.stringIndex.add(3, 'de');
        this.stringIndex.add(4, 'ac');

        this.query = 'a';
      });

      it('should return the ID of the lexicographically smallest match', function () {
        const stringIDs = this.stringIndex.findAll.thatContain(this.query);
        stringIDs.should
          .containEql('1')
          .and.containEql('2')
          .and.containEql('4')
          .and.have.length(3);
      });
    });
  });
});
