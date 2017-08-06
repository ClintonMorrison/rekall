'use strict';

import util from './util';

class TrieNode {
  constructor(parent, labels) {
    this.childrenByLeadingChar = {};
    this.edgesByLeadingChar = {};
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
    const edge = this.edgesByLeadingChar[leadingChar];
    if (!this.childrenByLeadingChar[leadingChar]) {
      return {
        lastNode: this,
        remainingPattern: pattern,
      };
    }

    // Check if whole edge matches patterns
    if (!util.startsWith(pattern, edge)) {
      return {
        lastNode: this,
        remainingPattern: pattern,
      };
    }

    // Strip matched character and keep matching rest of pattern
    const remainingPattern = pattern.substring(edge.length),
      child = this.childrenByLeadingChar[leadingChar];

    return child._matchUntilMismatch(remainingPattern);
  }

  match(pattern) {
    const result = this._matchUntilMismatch(pattern);
    return (result.remainingPattern.length === 0) ? result.lastNode : null;
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

    util.each(this.childrenByLeadingChar, (child) => {
      children.push(child);
    });

    return children;
  }

  _connectByEdge(childToConnect, edge) {
    if (!edge) {
      throw new Error('Cannot connect by empty edge');
    }

    // TODO: this could validate edge doesn't already exist
    const leadingChar = edge[0];
    
    if (this.edgesByLeadingChar[leadingChar]) {
      throw new Error('An edge with the leading character already exists');
    }
    
    this.childrenByLeadingChar[leadingChar] = childToConnect;
    this.edgesByLeadingChar[leadingChar] = edge;
    return childToConnect;
  }

  add(str, labelsForLeaf) {
    const result = this._matchUntilMismatch(str);
    let node = result.lastNode;
    let nextNode;

    if (result.remainingPattern.length > 0) {
      node = this._addChild(result.remainingPattern);
    }

    util.each(labelsForLeaf, (label) => {
      node.labels[label] = true;
    });
  }

  _addChild(pattern) {
    const leadingChar = pattern[0];
    const existingEdge = this.edgesByLeadingChar[leadingChar] || '';

    // Split the edge into the prefix and the rest
    const prefixLength = util.getLengthOfCommonPrefix(existingEdge, pattern);
    const prefix = existingEdge.slice(0, prefixLength);
    const edgeRemainder = existingEdge.slice(prefixLength);
    const patternRemainder = pattern.slice(prefixLength);
    
    if (prefix && edgeRemainder) {
      // Disconnect the child on the edge
      const oldChild =  this.childrenByLeadingChar[leadingChar];
      delete this.edgesByLeadingChar[leadingChar];
      delete this.childrenByLeadingChar[leadingChar];

      // Connect a new node by the prefix
      const newChild = this._connectByEdge(new TrieNode(), prefix);

      // Reconnect old node with the remainder
      newChild._connectByEdge(oldChild, edgeRemainder);

      // Add rest of path if some of the pattern is still unmatched
      if (patternRemainder) {
        return newChild._addChild(patternRemainder);
      }

      return newChild;
    } 
    
    if (prefix && !edgeRemainder) {
      throw new Error('tried to add child where edge already had prefix')
    }

    // If no shared prefix, connect the new node with a new edge
    if (patternRemainder) {
      return this._connectByEdge(new TrieNode(), patternRemainder);
    }

    // Return current node if no pattern left
    return this;
  }

  isLeaf() {
    for (const c in this.childrenByLeadingChar) {
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
      maxDepth = Math.max(depth, maxDepth);
    });

    return maxDepth;
  };

  size() {
    let child;
    let total = 1;

    if (this.isLeaf()) {
      return total;
    }

    util.each(this.children(), (child) => {
      total += child.size();
    });

    return total;
  }

  prettyPrint(padding) {
    if (!padding) {
      padding = '';
    }

    const lines = [''];
    let is_last_child = false;
    let index = 0;

    for (const c in this.edgesByLeadingChar) {
      is_last_child = index == (Object.keys(this.childrenByLeadingChar).length - 1);
      const arrow = is_last_child ? '└' : '├';
      let child_prefix = `${padding}${is_last_child ? ' ' : '|'}  `;
      const edge = this.edgesByLeadingChar[c];
      const child = this.childrenByLeadingChar[c];
      const labels = this.constructor.getUniqueLabels([child]);
      const labelsText = labels.length > 0 ? ` [${labels.join(', ')}]` : '';
      lines.push(`${padding}${arrow}─ ${edge} ${labelsText}${child.prettyPrint(child_prefix)}`);
      index += 1;
    }
    return lines.join("\n");
  }

  static getUniqueLabels(nodes) {
    const labels = {};

    util.each(nodes, (node) => {
      util.each(node.labels, (value, label) => {
        labels[label] = true;
      });
    });

    return Object.keys(labels);
  }
}

module.exports = TrieNode;
