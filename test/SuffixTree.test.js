import SuffixTree from '../src/SuffixTree';


describe('SuffixTree#constructor', () => {
  it('should create a SuffixTree', () => {
    const tree = new SuffixTree(['test']);
  });

  it('should create a SuffixTree over 1 string with the correct depth', () => {
    const tree = new SuffixTree(['abcd']);
    tree.depth().should.be.exactly(4);
  });

  it('should create a SuffixTree over 2 strings with the correct depth', () => {
    const tree = new SuffixTree(['abcd', 'abcef']);
    tree.depth().should.be.exactly(5);
  });
});

describe('SuffixTree#add', () => {
  it('should add a string to the trie', () => {
    const tree = new SuffixTree([]);
    tree.depth().should.be.exactly(0);
    
    tree.add('a$');
    tree.depth().should.be.exactly(2);
    tree.strings[0].should.be.exactly('a$');
        
    tree.add('ab$');
    tree.depth().should.be.exactly(3);
    tree.strings[1].should.be.exactly('ab$');

    
    tree.add('abc$');
    tree.depth().should.be.exactly(4);
    tree.strings[2].should.be.exactly('abc$');
  });
});