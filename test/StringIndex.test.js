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
        this.query = 'cd';
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

  /*
  describe('#findOne.thatEquals', function () {
    context('there is one matching string', function () {
      const strings = ['Cat', 'Dog', 'Bird'];
      const query = 'Cat';
      const stringIndex = new StringIndex();
      stringIndex.add(1, 'Cat');
      stringIndex.add(2, 'Dog');
      stringIndex.add(3, 'Bird');

      it('should return the index of the matching string', function () {
        const stringId = this.stringIndex.fineOne.thatEquals(query);
        expect(stringId).to.equal(1);
      });
    });
  });
  */
});
