'use strict';

var util = require('./util');
var Trie = require('./Trie');

var SuffixTree = function (strings) {
  this.trie 
}

SuffixTree.prototype = Object.create(Trie.prototype);
SuffixTree.prototype.constructor = SuffixTree;

SuffixTree.prototype.add = function (string) {
  TrieNode.prototype.add.call(this, string, this.nextStringID);
  this.strings[this.nextStringID] = string;
  this.nextStringID += 1;
}


module.exports = SuffixTree;
