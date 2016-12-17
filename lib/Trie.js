'use strict';

var util = require('./util');


var Trie = function (strings) {
  var i;

  if (!strings) {
    strings = [];
  }

  // Convert list of strings into map
  this.strings = {};
  for (i = 0; i < strings.length; i += 1) {
    this.strings[i] = strings[i];
  }

  this.nextStringID = strings.length;
  this.root = new TrieNode();

  // Add each string to trie
  for (var id in this.strings) {
    this.root.add(this.strings[id], id);
  }
}

Trie.prototype.match = function (pattern) {
  return this.root.match(pattern);
};

Trie.prototype.depth = function () {
  return this.root.depth();
}




var TrieNode = function (trie, parent) {
  this.childrenByLeadingChar = {};
  this.edgeLabels = {};
  this.trie = trie;
  this.stringIDs = null; // For leaves only
};


TrieNode.prototype._matchUntilMismatch = function (pattern) {
  // Empty string matches anything
  if (!pattern) {
    return {
      lastNode: this,
      remainingPattern: '',
    };
  }

  // Check if first character matches leading character of any edge
  var leadingChar = pattern[0];
  if (!this.childrenByLeadingChar[leadingChar]) {
    return {
      lastNode: this,
      remainingPattern: pattern,
    };
  }

  // Check if whole edge matches pattern
  if (!util.startsWith(pattern, this.edgeLabels[leadingChar])) {
    return {
      lastNode: this,
      remainingPattern: pattern,
    };
  }

  // Strip matched characters and keep matching rest of pattern
  var remainingPattern = pattern.substring(this.edgeLabels[leadingChar]),
    child = this.childrenByLeadingChar[leadingChar];

  return child._matchUntilMismatch(remainingPattern);
};

TrieNode.prototype.match = function (pattern) {
  var result = this._matchUntilMismatch(pattern);

  return (result.remainingPattern.length === 0) ? result.lastNode : false;
};

TrieNode.prototype.leaves = function () {

};

TrieNode.prototype.add = function(str, strID) {
  var result = this._matchUntilMismatch(str),
    node = result.lastNode,
    chars = result.remainingPattern.split(''),
    i,
    c,
    nextNode;

  for (i = 0; i < chars.length; i += 1) {
    c = chars[i];
    nextNode = new TrieNode(this.trie);
    node.edgeLabels[c] = c;
    node.childrenByLeadingChar[c] = nextNode;

    node = nextNode;
  }

};


TrieNode.prototype.collapse = function () {

};

TrieNode.prototype.isLeaf = function () {
  for (var c in this.childrenByLeadingChar) {
    return false;
  }

  return true;
};

TrieNode.prototype.depth = function () {
  var child,
    depth,
    maxDepth = 0;

  if (this.isLeaf()) {
    return 0;
  }

  for (var c in this.childrenByLeadingChar) {
    depth = 1 + this.childrenByLeadingChar[c].depth();

    if (depth > maxDepth) {
      maxDepth = depth;
    }
  }

  return maxDepth;
};






module.exports = Trie;
