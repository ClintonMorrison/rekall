import StringIndex from '../src/StringIndex';


describe('StringIndex#_encode', () => {
  it('should replace "$" with "\\$"', () => {
    StringIndex._encode('ABCD$ TEST$').should.be.exactly('ABCD\\$ TEST\\$');
  });

  it('should replace "^" with "\\^"', () => {
    StringIndex._encode('ABCD^ TEST^').should.be.exactly('ABCD\\^ TEST\\^');
  });
});

describe('StringIndex#_decode', () => {
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

describe('StringIndex#whereStringEquals', () => {
  it('should return the index of equal strings', () => {
    var stringIndex = new StringIndex();
    stringIndex.add(1, 'test string');
    stringIndex.whereStringEquals('test string').should.match(['1']);
  });
});

/*
describe('StringIndex#findOne.thatEquals', () => {
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
