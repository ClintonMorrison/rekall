'use strict';

var Trie = require('../lib/Trie');

var emptyTrie = new Trie();

describe('Trie#match', function () {
  it('should match an empty string', function () {
	  emptyTrie.match('').should.be.exactly(emptyTrie.root);
  });
});

describe('Trie#constructor', function () {
  it('should create a trie', function () {
    var trie = new Trie(['test']);
  });

  it('should create a trie over 1 string with the correct depth', function () {
    var trie = new Trie(['abcd']);
    trie.depth().should.be.exactly(4);
  });

  it('should create a trie over 2 strings with the correct depth', function () {
    var trie = new Trie(['abcd'], ['abcd', 'abcef']);
    trie.depth().should.be.exactly(5);
  });
});
