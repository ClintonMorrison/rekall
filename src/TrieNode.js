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
    // TODO: this could validate edge doesn't already exist
    const leadingChar = edge[0];
    this.childrenByLeadingChar[leadingChar] = childToConnect;
    this.edgesByLeadingChar[leadingChar] = edge;
  }

  _addChild(edge) {
    const newNode = new TrieNode();
    this._connectByEdge(newNode, edge);
    // TODO: check if prefix already exists, split path if necessary
    return newNode;
  }

  add(str, labelsForLeaf) {
    const result = this._matchUntilMismatch(str);
    let node = result.lastNode;
    let nextNode;

    util.each(result.remainingPattern, (char) => {
      nextNode = node._addChild(char);
      node = nextNode;
    });

    util.each(labelsForLeaf, (label) => {
      node.labels[label] = true;
    });
  }

  splitEdge(prefixToSplit) {
    const leadingChar = prefixToSplit[0];
    const edge = this.edgesByLeadingChar[leadingChar];

    // Split the edge into the prefix and the rest
    const prefixLength = util.getLengthOfCommonPrefix(edge, prefixToSplit);
    const prefix = edge.slice(0, prefixLength);
    const remainder = edge.slice(prefixLength);

    // Disconnect the child on the edge
    const oldChild =  this.childrenByLeadingChar[leadingChar];
    delete this.edgesByLeadingChar[leadingChar];
    delete this.childrenByLeadingChar[leadingChar];

    // Connect a new node by the prefix
    const newNode = this._addChild(prefix);

    // Reconnect old node with the remainder
    newNode._connectByEdge(oldNode, remainder);

    return newNode;
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

    for (const c in this.childrenByLeadingChar) {
      is_last_child = index == (Object.keys(this.childrenByLeadingChar).length - 1);
      const arrow = is_last_child ? '└' : '├';
      const child_prefix = `${padding}${is_last_child ? ' ' : '|'}  `;
      lines.push(`${padding}${arrow}─ ${c}${this.childrenByLeadingChar[c].prettyPrint(child_prefix)}`);
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
