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


describe('Trie#match', function () {
  it('should match an empty string', function () {
	  emptyTrie.match('').should.be.exactly(emptyTrie.root);
  });
  
  it('should return false if the pattern does not match', function () {
    var trie = new Trie(['apple', 'apricot', 'banana']);
    trie.match('zebra').should.be.exactly(false);
    trie.match('pple').should.be.exactly(false);
    trie.match('ana').should.be.exactly(false);
  });
  
  it('should match prefixes of strings in the trie', function () {
    var trie = new Trie(['apple', 'apricot', 'banana']);
    trie.match('a').should.be.exactly(trie.root.childrenByEdge['a']);
    
    trie.match('ap').should.be.exactly(
      trie.root.childrenByEdge['a'].childrenByEdge['p']
    );
    
    trie.match('banan').should.be.exactly(trie.root
      .childrenByEdge['b']
      .childrenByEdge['a']
      .childrenByEdge['n']
      .childrenByEdge['a']
      .childrenByEdge['n']
    );
  });
  
  it('should match strings contained in the trie', function () {
    var trie = new Trie(['apple$', 'app$', 'cat$']);
    trie.match('app$').should.be.exactly(trie.root
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

