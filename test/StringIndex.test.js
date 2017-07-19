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
  it('should remove a leading "^" and trailing "$" characters', () => {
    StringIndex._decode('^test$').should.be.exactly('test');
  });

  it('should replace "\\^" with "^"', () => {
    StringIndex._decode('^test\\^test$').should.be.exactly('test^test');
  });

  it('should replace "\\$" with "$"', () => {
    StringIndex._decode('^test\\$test$').should.be.exactly('test$test');
  });
});

describe('StringIndex#whereStringEquals', () => {
  it('should return the index of equal strings', () => {
    var stringIndex = new StringIndex();
    stringIndex.add('test string');
    stringIndex.whereStringEquals('test string').should.match(['0']);
  });
});
