'use strict';

var util = require('./util');

var TrieNode = function (trie, parent) {
  this.childrenByEdge = {};
  this.trie = trie;
  this.stringIDs = null; // For leaves only
  this.parent = parent;
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
  if (!this.childrenByEdge[leadingChar]) {
    return {
      lastNode: this,
      remainingPattern: pattern,
    };
  }

  // Check if whole edge matches pattern
  if (!util.startsWith(pattern, leadingChar)) {
    return {
      lastNode: this,
      remainingPattern: pattern,
    };
  }

  // Strip matched character and keep matching rest of pattern
  var remainingPattern = pattern.substring(1),
    child = this.childrenByEdge[leadingChar];

  return child._matchUntilMismatch(remainingPattern);
};

TrieNode.prototype._match = function (pattern) {
  var result = this._matchUntilMismatch(pattern);

  return (result.remainingPattern.length === 0) ? result.lastNode : false;
};

// TODO: add match method that returns string IDs

TrieNode.prototype.leaves = function () {
  
};

TrieNode.prototype.siblings = function () {
  if (!this.parent) {
    return [];
  }
  
  var that = this;
  this.parent.children.map(function (node) { return node != that});
};

TrieNode.prototype.children = function () {
  var children = [];
  for (var c in this.childrenByEdge) {
    children.push(this.childrenByEdge[c]);
  }
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
    node.childrenByEdge[c] = nextNode;

    node = nextNode;
  }

};


TrieNode.prototype.collapse = function () {

};

TrieNode.prototype.isLeaf = function () {
  for (var c in this.childrenByEdge) {
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

  for (var c in this.childrenByEdge) {
    depth = 1 + this.childrenByEdge[c].depth();

    if (depth > maxDepth) {
      maxDepth = depth;
    }
  }

  return maxDepth;
};

TrieNode.prototype.prettyPrint = function (padding) {
  if (!padding) {
    padding = '';
  }
  
  var lines = [''];
  var is_last_child = false;
  var index = 0;
  for (var c in this.childrenByEdge) {
    is_last_child = index == (Object.keys(this.childrenByEdge).length - 1);
    var arrow = is_last_child ? '└' : '├';
    var child_prefix = padding + (is_last_child ? ' ' : '|') + '  ';
    lines.push(padding + arrow + '─ ' + c + this.childrenByEdge[c].prettyPrint(child_prefix));
    index += 1;
  }
  return lines.join("\n");
};


var Trie = function (strings) {
  TrieNode.call(this, this, null);
  
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

  // Add each string to trie
  for (var id in this.strings) {
    this.add(this.strings[id], id);
  }
}

Trie.prototype = Object.create(TrieNode.prototype);
Trie.prototype.constructor = Trie;

Trie.prototype.add = function (string) {
  TrieNode.prototype.add.call(this, string, this.nextStringID);
  this.strings[this.nextStringID] = string;
  this.nextStringID += 1;
}


module.exports = Trie;
