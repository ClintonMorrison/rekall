import StringIndex from '../src/StringIndex';

describe('StringIndex', () => {
  describe('#_encode', () => {
    it('should replace "$" with "\\$"', () => {
      StringIndex._encode('ABCD$ TEST$').should.be.exactly('ABCD\\$ TEST\\$');
    });

    it('should replace "^" with "\\^"', () => {
      StringIndex._encode('ABCD^ TEST^').should.be.exactly('ABCD\\^ TEST\\^');
    });
  });

  describe('#_decode', () => {
    it('should not change a string the does not have "^" and "$" characters', () => {
      StringIndex._decode('test').should.be.exactly('test');
    });

    it('should replace "\\^" with "^"', () => {
      StringIndex._decode('test\\^test').should.be.exactly('test^test');
    });

    it('should replace "\\$" with "$"', () => {
      StringIndex._decode('test\\$test').should.be.exactly('test$test');
    });
  });

  describe('#_getIDsWhereStringEquals', () => {
    context('there is a string equal to the query', () => {
      const stringIndex = new StringIndex();
      stringIndex.add(1, 'test string');
      const query = 'test string';

      it('should return the id of the equal string', () => {
        stringIndex._getIDsWhereStringEquals(query).should.match(['1']);
      });
    });

    context('there is not a string equal to the query', () => {
      const stringIndex = new StringIndex();
      stringIndex.add(1, 'test string');
      const query = 'test stri';

      it('should return an empty array', () => {
        stringIndex._getIDsWhereStringEquals(query).should.be.empty();
      });
    });
  });

  /*
  describe('#findOne.thatEquals', () => {
    context('there is one matching string', () => {
      const strings = ['Cat', 'Dog', 'Bird'];
      const query = 'Cat';
      const stringIndex = new StringIndex();
      stringIndex.add(1, 'Cat');
      stringIndex.add(2, 'Dog');
      stringIndex.add(3, 'Bird');

      it('should return the index of the matching string', () => {
        const stringId = this.stringIndex.fineOne.thatEquals(query);
        expect(stringId).to.equal(1);
      });
    });
  });
  */
});
