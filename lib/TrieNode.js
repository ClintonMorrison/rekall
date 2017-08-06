'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrieNode = function () {
  function TrieNode(parent, labels) {
    _classCallCheck(this, TrieNode);

    this.childrenByLeadingChar = {};
    this.edgesByLeadingChar = {};
    this.labels = labels || {};
    this.parent = parent;
  }

  _createClass(TrieNode, [{
    key: '_matchUntilMismatch',
    value: function _matchUntilMismatch(pattern) {
      // Empty string matches anything
      if (!pattern) {
        return {
          lastNode: this,
          remainingPattern: ''
        };
      }

      // Check if first character matches leading character of any edge
      var leadingChar = pattern[0];
      var edge = this.edgesByLeadingChar[leadingChar];
      if (!this.childrenByLeadingChar[leadingChar]) {
        return {
          lastNode: this,
          remainingPattern: pattern
        };
      }

      // Check if whole edge matches patterns
      if (!_util2.default.startsWith(pattern, edge)) {
        return {
          lastNode: this,
          remainingPattern: pattern
        };
      }

      // Strip matched character and keep matching rest of pattern
      var remainingPattern = pattern.substring(edge.length),
          child = this.childrenByLeadingChar[leadingChar];

      return child._matchUntilMismatch(remainingPattern);
    }
  }, {
    key: 'match',
    value: function match(pattern) {
      var result = this._matchUntilMismatch(pattern);
      return result.remainingPattern.length === 0 ? result.lastNode : null;
    }
  }, {
    key: 'leaves',
    value: function leaves() {
      if (this.isLeaf()) {
        return [this];
      }

      var leaves = [];
      var children = this.children();
      var child = void 0;
      var i = void 0;

      for (i = 0; i < children.length; i++) {
        child = children[i];
        leaves = child.leaves().concat(leaves);
      }

      return leaves;
    }
  }, {
    key: 'siblings',
    value: function siblings() {
      var _this = this;

      if (!this.parent) {
        return [];
      }

      this.parent.children().map(function (node) {
        return node != _this;
      });
    }
  }, {
    key: 'children',
    value: function children() {
      var children = [];

      _util2.default.each(this.childrenByLeadingChar, function (child) {
        children.push(child);
      });

      return children;
    }
  }, {
    key: '_connectByEdge',
    value: function _connectByEdge(childToConnect, edge) {
      // TODO: this could validate edge doesn't already exist
      var leadingChar = edge[0];
      this.childrenByLeadingChar[leadingChar] = childToConnect;
      this.edgesByLeadingChar[leadingChar] = edge;
      return childToConnect;
    }
  }, {
    key: 'add',
    value: function add(str, labelsForLeaf) {
      var result = this._matchUntilMismatch(str);
      var node = result.lastNode;
      var nextNode = void 0;

      if (result.remainingPattern.length > 0) {
        node = this._addChild(result.remainingPattern);
      }

      _util2.default.each(labelsForLeaf, function (label) {
        node.labels[label] = true;
      });
    }
  }, {
    key: '_addChild',
    value: function _addChild(pattern) {
      var leadingChar = pattern[0];
      var existingEdge = this.edgesByLeadingChar[leadingChar] || '';

      // Split the edge into the prefix and the rest
      var prefixLength = _util2.default.getLengthOfCommonPrefix(existingEdge, pattern);
      var prefix = existingEdge.slice(0, prefixLength);
      var edgeRemainder = existingEdge.slice(prefixLength);
      var patternRemainder = pattern.slice(prefixLength);

      if (prefix) {
        // Disconnect the child on the edge
        var oldChild = this.childrenByLeadingChar[leadingChar];
        delete this.edgesByLeadingChar[leadingChar];
        delete this.childrenByLeadingChar[leadingChar];

        // Connect a new node by the prefix
        var newChild = this._connectByEdge(new TrieNode(), prefix);

        // Reconnect old node with the remainder
        newChild._connectByEdge(oldChild, edgeRemainder);

        // Add rest of path if some of the pattern is still unmatched
        if (patternRemainder) {
          return newChild._addChild(patternRemainder);
        }

        return newChild;
      }

      // If no shared prefix, connect the new node with a new edge
      if (patternRemainder) {
        return this._connectByEdge(new TrieNode(), patternRemainder);
      }

      // Return current node if no pattern left
      return this;
    }
  }, {
    key: 'isLeaf',
    value: function isLeaf() {
      for (var c in this.childrenByLeadingChar) {
        return false;
      }

      return true;
    }
  }, {
    key: 'depth',
    value: function depth() {
      var child = void 0;
      var depth = 0;
      var maxDepth = 0;

      if (this.isLeaf()) {
        return 0;
      }

      _util2.default.each(this.children(), function (child) {
        depth = 1 + child.depth();
        maxDepth = Math.max(depth, maxDepth);
      });

      return maxDepth;
    }
  }, {
    key: 'size',
    value: function size() {
      var child = void 0;
      var total = 1;

      if (this.isLeaf()) {
        return total;
      }

      _util2.default.each(this.children(), function (child) {
        total += child.size();
      });

      return total;
    }
  }, {
    key: 'prettyPrint',
    value: function prettyPrint(padding) {
      if (!padding) {
        padding = '';
      }

      var lines = [''];
      var is_last_child = false;
      var index = 0;

      for (var c in this.edgesByLeadingChar) {
        is_last_child = index == Object.keys(this.childrenByLeadingChar).length - 1;
        var arrow = is_last_child ? '└' : '├';
        var child_prefix = '' + padding + (is_last_child ? ' ' : '|') + '  ';
        var edge = this.edgesByLeadingChar[c];
        var child = this.childrenByLeadingChar[c];
        var labels = this.constructor.getUniqueLabels([child]);
        var labelsText = labels.length > 0 ? ' [' + labels.join(', ') + ']' : '';
        lines.push('' + padding + arrow + '\u2500 ' + edge + ' ' + labelsText + child.prettyPrint(child_prefix));
        index += 1;
      }
      return lines.join("\n");
    }
  }], [{
    key: 'getUniqueLabels',
    value: function getUniqueLabels(nodes) {
      var labels = {};

      _util2.default.each(nodes, function (node) {
        _util2.default.each(node.labels, function (value, label) {
          labels[label] = true;
        });
      });

      return Object.keys(labels);
    }
  }]);

  return TrieNode;
}();

module.exports = TrieNode;