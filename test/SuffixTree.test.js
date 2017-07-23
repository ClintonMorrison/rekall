import SuffixTree from '../src/SuffixTree';


describe('SuffixTree#constructor', () => {
  it('should create a SuffixTree', () => {
    const tree = new SuffixTree();
    tree.add(1, 'test');
  });

  it('should create a SuffixTree over 1 string with the correct depth', () => {
    const tree = new SuffixTree();
    tree.add(1, 'abcd');
    tree.depth().should.be.exactly(4);
  });

  it('should create a SuffixTree over 2 strings with the correct depth', () => {
    const tree = new SuffixTree();
    tree.add(1, 'abcd');
    tree.add(2, 'abcde');
    tree.depth().should.be.exactly(5);
  });
});

describe('SuffixTree#add', () => {
  it('should add a string to the trie', () => {
    const tree = new SuffixTree();
    tree.depth().should.be.exactly(0);

    tree.add(1, 'a$');
    tree.depth().should.be.exactly(2);
    tree.strings[1].should.be.exactly('a$');

    tree.add(2, 'ab$');
    tree.depth().should.be.exactly(3);
    tree.strings[2].should.be.exactly('ab$');


    tree.add(3, 'abc$');
    tree.depth().should.be.exactly(4);
    tree.strings[3].should.be.exactly('abc$');
  });
});

describe('SuffixTree#getMatchingStringIDs', () => {
  it('should return an empty array if there is no match', () => {
    const tree = new SuffixTree();
    tree.add(1, 'abc');
    tree.getMatchingStringIDs('d').should.be.empty();
  });

  it('should return the matching string IDs if there is a match', () => {
    const tree = new SuffixTree();
    tree.add(1, 'abc');
    tree.add(2, 'xyz');
    const stringIDs = tree.getMatchingStringIDs('x');
    stringIDs.should.have.length(1);
    tree.getStringByID(stringIDs[0]).should.be.exactly('xyz');
  });
});

describe('SuffixTree#getMatchingStrings', () => {
  it('should return an empty array if there is no match', () => {
    const tree = new SuffixTree();
    tree.add(1, 'abc');
    tree.getMatchingStrings('d').should.be.empty();
  });

  it('should return the matching strings if there is a match', () => {
    const tree = new SuffixTree();
    tree.add(1, 'abc');
    tree.add(2, 'xyz');
    const strings = tree.getMatchingStrings('x');
    strings.should.have.length(1);
    strings[0].should.be.exactly('xyz');
  });
});

/*
describe('SuffixTree#getMatchingLabels', () => {
  it('should return an empty array if there is no match', () => {
    const rootNode = new TrieNode();
    const nodeA = new TrieNode(rootNode);
    const nodeB = new TrieNode(rootNode);
    rootNode.childrenByEdge['a'] = nodeA;
    rootNode.childrenByEdge['b'] = nodeB;
    nodeA.labels.label1 = true;

    const labels = rootNode.getMatchingLabels('abc');
    labels.should.have.length(0);
  });

  it('should should return an array of labels if there is a match', () => {
    const rootNode = new TrieNode();
    const nodeA = new TrieNode(rootNode);
    const nodeB = new TrieNode(rootNode);
    rootNode.childrenByEdge['a'] = nodeA;
    rootNode.childrenByEdge['b'] = nodeB;
    nodeA.labels.label1 = true;
    nodeA.labels.label2 = true;

    const labels = rootNode.getMatchingLabels('');
    labels.should.have.length(2);
    labels[0].should.equal('label1');
    labels[1].should.equal('label2');
  });
});
*/
