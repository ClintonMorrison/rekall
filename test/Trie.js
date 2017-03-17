'use strict';

var Trie = require('../lib/Trie');

var emptyTrie = new Trie();


describe('Trie#constructor', function () {
  it('should create a trie', function () {
    var trie = new Trie(['test']);
  });

  it('should create a trie over 1 string with the correct depth', function () {
    var trie = new Trie(['abcd']);
    trie.depth().should.be.exactly(4);
  });

  it('should create a trie over 2 strings with the correct depth', function () {
    var trie = new Trie(['abcd', 'abcef']);
    trie.depth().should.be.exactly(5);
  });
});


describe('Trie#_addChild', function () {
  it('should add a child', function () {
    var trie = new Trie();
    trie.childrenByEdge.should.match({});
  });
});

describe('Trie#getLocus', function () {
  it('should match an empty string', function () {
	  emptyTrie.getLocus('').should.be.exactly(emptyTrie);
  });
  
  it('should return false if the pattern does not match', function () {
    var trie = new Trie(['apple', 'apricot', 'banana']);
    trie.getLocus('zebra').should.be.exactly(false);
    trie.getLocus('pple').should.be.exactly(false);
    trie.getLocus('ana').should.be.exactly(false);
  });
  
  it('should match prefixes of strings in the trie', function () {
    var trie = new Trie(['apple', 'apricot', 'banana']);
    trie.getLocus('a').should.be.exactly(trie.childrenByEdge['a']);
    
    trie.getLocus('ap').should.be.exactly(
      trie.childrenByEdge['a'].childrenByEdge['p']
    );
    
    trie.getLocus('banan').should.be.exactly(trie
      .childrenByEdge['b']
      .childrenByEdge['a']
      .childrenByEdge['n']
      .childrenByEdge['a']
      .childrenByEdge['n']
    );
  });
  
  it('should match strings contained in the trie', function () {
    var trie = new Trie(['apple$', 'app$', 'cat$']);
    trie.getLocus('app$').should.be.exactly(trie
      .childrenByEdge['a']
      .childrenByEdge['p']
      .childrenByEdge['p']
      .childrenByEdge['$']
    );
  });
  
});

describe('Trie#add', function () {
  it('should add a string to the trie', function () {
    var trie = new Trie();
    trie.depth().should.be.exactly(0);
    
    trie.add('a$');
    trie.depth().should.be.exactly(2);
    trie.strings[0].should.be.exactly('a$');
        
    trie.add('ab$');
    trie.depth().should.be.exactly(3);
    trie.strings[1].should.be.exactly('ab$');

    
    trie.add('abc$');
    trie.depth().should.be.exactly(4);
    trie.strings[2].should.be.exactly('abc$');

  });
});

describe('Trie#prettyPrint', function () {
  it('should return empty string when trie is empty', function () {
    var trie = new Trie();
    trie.prettyPrint().should.be.exactly('');
  });
  
  it('should print the trie', function () {
    var trie = new Trie(['abcd$', 'abce$', 'abfg$', 'abcde$', 'xyz$', 'xz$']);
    trie.prettyPrint().should.be.exactly([
      '',
      '├─ a',
      '|  └─ b',
      '|     ├─ c',
      '|     |  ├─ d',
      '|     |  |  ├─ $',
      '|     |  |  └─ e',
      '|     |  |     └─ $',
      '|     |  └─ e',
      '|     |     └─ $',
      '|     └─ f',
      '|        └─ g',
      '|           └─ $',
      '└─ x',
      '   ├─ y',
      '   |  └─ z',
      '   |     └─ $',
      '   └─ z',
      '      └─ $'
    ].join('\n'));
  });
});


describe('Trie.Node#isLeaf', function () {
  it('should return false is the node has any children', function () {
    var rootNode = new Trie.Node(),
      leftNode = new Trie.Node(rootNode),
      rightNode = new Trie.Node(rootNode);
    
    rootNode.childrenByEdge['L'] = leftNode;
    rootNode.isLeaf().should.be.false();
    
    rootNode.childrenByEdge['R'] = rightNode;
    rootNode.isLeaf().should.be.false();
  });
  
  it('should return true is the node has no children', function () {
    var rootNode = new Trie.Node();
    rootNode.isLeaf().should.be.true();
  });
});

describe('Trie.Node#depth', function () {
  it('should return 0 for the root node', function () {
      var rootNode = new Trie.Node();
      rootNode.depth().should.be.exactly(0);
  });
  
  it('should print the length of the longest path from the root to a leaf', function () {
    var rootNode = new Trie.Node();
    rootNode.depth().should.be.exactly(0);
    
    var firstChild = new Trie.Node({ rootNode: rootNode }. rootNode);
    rootNode.childrenByEdge['a'] = firstChild;
    rootNode.depth().should.be.exactly(1);
    
    var secondChild = new Trie.Node(rootNode);
    var childOfSecondChild = new Trie.Node(secondChild);
    rootNode.childrenByEdge['b'] = secondChild;
    secondChild.childrenByEdge['c'] = childOfSecondChild;
    rootNode.depth().should.be.exactly(2);
  });
  
});

describe('Trie.Node#children', function () {
  it('should return an empty array if the node has no children', function () {
    var rootNode = new Trie.Node();
    rootNode.children().should.be.an.Array().and.be.empty();
  });
  
  it('should return an array of nodes', function () {
    var rootNode = new Trie.Node();
    var nodeA = new Trie.Node(rootNode);
    var nodeB = new Trie.Node(rootNode);
    rootNode.childrenByEdge['a'] = nodeA;
    rootNode.childrenByEdge['b'] = nodeB;
    
    var nodeC = new Trie.Node(nodeA);
    nodeA.childrenByEdge['c'] = nodeC;

    var children = rootNode.children();
    children.should.be.an.Array();
    children.should.have.length(2);
    children[0].should.equal(nodeA);
    children[1].should.equal(nodeB);
  });
  
});

describe('Trie.Node#leaves', function () {
  it('should return an array with just the node if the node is a leaf', function () {
    var rootNode = new Trie.Node();
    var leaves = rootNode.leaves();
    leaves.should.be.an.Array();
    leaves.should.have.length(1);
    leaves[0].should.equal(rootNode);
  });
  
  it('should return an array of leaf nodes', function () {
    var rootNode = new Trie.Node();
    var nodeA = new Trie.Node(rootNode);
    var nodeB = new Trie.Node(rootNode);
    rootNode.childrenByEdge['a'] = nodeA;
    rootNode.childrenByEdge['b'] = nodeB;
    
    var nodeC = new Trie.Node(nodeA);
    nodeA.childrenByEdge['c'] = nodeC;
    
    var leaves = rootNode.leaves();
    leaves.should.be.an.Array();
    leaves.should.have.length(2);
    leaves[0].should.equal(nodeB);
    leaves[1].should.equal(nodeC);
  });
  
});


describe('Trie.Node#TODO', function () {
  it('should ', function () {
    
  });
  
  it('should ', function () {
    
  });

});
