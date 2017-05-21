'use strict';

import util from './util';

class TrieNode {
  constructor(parent, labels) {
    this.childrenByEdge = {};
    this.labels = labels || {};
    this.parent = parent;
  }
  
  _matchUntilMismatch(pattern) {
    // Empty string matches anything
    if (!pattern) {
      return {
        lastNode: this,
        remainingPattern: '',
      };
    }
  
    // Check if first character matches leading character of any edge
    const leadingChar = pattern[0];
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
    const remainingPattern = pattern.substring(1),
      child = this.childrenByEdge[leadingChar];
  
    return child._matchUntilMismatch(remainingPattern);
  }
  
  getLocus(pattern) {
    const result = this._matchUntilMismatch(pattern);
    return (result.remainingPattern.length === 0) ? result.lastNode : false;
  }
  
  getMatchingLabels(pattern) {
    const labels = {};
    const locus = this.getLocus(pattern);
    
    if (!locus) {
      return [];
    }
    
    // TODO: consider function for getting unique labels from collection of nodes
    util.each(locus.leaves(), function (leaf) {
      util.each(leaf.labels, (value, label) => {
        labels[label] = true;
      });
    });
    
    return Object.keys(labels);
  }
  
  leaves() {
    if (this.isLeaf()) {
      return [ this ];
    }
    
    let leaves = [];
    const children = this.children();
    let child;
    let i;
    
    for (i = 0; i < children.length; i++) {
      child = children[i];
      leaves = child.leaves().concat(leaves);
    }
    
    return leaves;
  }
  
  siblings() {
    if (!this.parent) {
      return [];
    }
    
    this.parent.children().map((node) => {
      return (node != this);
    });
  }
  
  children() {
    const children = [];
    
    util.each(this.childrenByEdge, (child) => {
      children.push(child);
    });
    
    return children;
  }
  
  _addChild(c) {
    const newNode = new TrieNode();
    this.childrenByEdge[c] = newNode;
    return newNode;
  }
  
  add(str, labelsForLeaf) {
    const result = this._matchUntilMismatch(str);
    let node = result.lastNode;
    let nextNode;
      
    util.each(result.remainingPattern, (char) => {
      nextNode = new TrieNode();
      node.childrenByEdge[char] = nextNode;
      node = nextNode;
    });
  
    util.each(labelsForLeaf, (label) => {
      node.labels[label] = true;
    });
  }
  
  isLeaf() {
    for (const c in this.childrenByEdge) {
      return false;
    }
  
    return true;
  }
  
  depth() {
    let child;
    let depth = 0;
    let maxDepth = 0;
  
    if (this.isLeaf()) {
      return 0;
    }
    
    util.each(this.children(), (child) => {
      depth = 1 + child.depth();
      maxDepth = depth;
    });
  
    return maxDepth;
  };
  
  prettyPrint(padding) {
    if (!padding) {
      padding = '';
    }
    
    const lines = [''];
    let is_last_child = false;
    let index = 0;
    
    for (const c in this.childrenByEdge) {
      is_last_child = index == (Object.keys(this.childrenByEdge).length - 1);
      const arrow = is_last_child ? '└' : '├';
      const child_prefix = `${padding}${is_last_child ? ' ' : '|'}  `;
      lines.push(`${padding}${arrow}─ ${c}${this.childrenByEdge[c].prettyPrint(child_prefix)}`);
      index += 1;
    }
    return lines.join("\n");
  }
}

module.exports = TrieNode;
