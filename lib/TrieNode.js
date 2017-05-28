'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TrieNode = function () {
  function TrieNode(parent, labels) {
    _classCallCheck(this, TrieNode);

    this.childrenByEdge = {};
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
      if (!this.childrenByEdge[leadingChar]) {
        return {
          lastNode: this,
          remainingPattern: pattern
        };
      }

      // Check if whole edge matches pattern
      if (!_util2.default.startsWith(pattern, leadingChar)) {
        return {
          lastNode: this,
          remainingPattern: pattern
        };
      }

      // Strip matched character and keep matching rest of pattern
      var remainingPattern = pattern.substring(1),
          child = this.childrenByEdge[leadingChar];

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

      _util2.default.each(this.childrenByEdge, function (child) {
        children.push(child);
      });

      return children;
    }
  }, {
    key: '_addChild',
    value: function _addChild(c) {
      var newNode = new TrieNode();
      this.childrenByEdge[c] = newNode;
      return newNode;
    }
  }, {
    key: 'add',
    value: function add(str, labelsForLeaf) {
      var result = this._matchUntilMismatch(str);
      var node = result.lastNode;
      var nextNode = void 0;

      _util2.default.each(result.remainingPattern, function (char) {
        nextNode = new TrieNode();
        node.childrenByEdge[char] = nextNode;
        node = nextNode;
      });

      _util2.default.each(labelsForLeaf, function (label) {
        node.labels[label] = true;
      });
    }
  }, {
    key: 'isLeaf',
    value: function isLeaf() {
      for (var c in this.childrenByEdge) {
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
    key: 'prettyPrint',
    value: function prettyPrint(padding) {
      if (!padding) {
        padding = '';
      }

      var lines = [''];
      var is_last_child = false;
      var index = 0;

      for (var c in this.childrenByEdge) {
        is_last_child = index == Object.keys(this.childrenByEdge).length - 1;
        var arrow = is_last_child ? '└' : '├';
        var child_prefix = '' + padding + (is_last_child ? ' ' : '|') + '  ';
        lines.push('' + padding + arrow + '\u2500 ' + c + this.childrenByEdge[c].prettyPrint(child_prefix));
        index += 1;
      }
      return lines.join("\n");
    }
  }], [{
    key: 'getUniqueLabelsOfNodes',
    value: function getUniqueLabelsOfNodes(nodes) {
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