'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    key: '_getChild',
    value: function _getChild(query) {
      var firstChar = _util2.default.getFirstElement(query);
      return this.childrenByLeadingChar[firstChar];
    }
  }, {
    key: '_getEdge',
    value: function _getEdge(query) {
      var firstChar = _util2.default.getFirstElement(query);
      return this.edgesByLeadingChar[firstChar];
    }
  }, {
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
      var edge = this._getEdge(pattern[0]);
      if (!this._getChild(pattern[0])) {
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
      var remainingPattern = pattern.substring(edge.length);
      var child = this._getChild(pattern[0]);

      return child._matchUntilMismatch(remainingPattern);
    }
  }, {
    key: 'match',
    value: function match(pattern) {
      var result = this._matchUntilMismatch(pattern);
      if (result.remainingPattern.length === 0) {
        return result.lastNode;
      }

      if (result.lastNode.hasEdgeWithPrefix(result.remainingPattern)) {
        return result.lastNode._getChild(result.remainingPattern[0]);
      }

      return null;
    }
  }, {
    key: 'leaves',
    value: function leaves() {
      if (this.isLeaf()) {
        return [this];
      }

      var leaves = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getChildren()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          leaves = child.leaves().concat(leaves);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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

      this.parent.getChildren().map(function (node) {
        return node !== _this;
      });
    }
  }, {
    key: 'getChildren',
    value: function getChildren() {
      var children = [];

      _util2.default.each(this.childrenByLeadingChar, function (child) {
        children.push(child);
      });

      return children;
    }
  }, {
    key: 'hasEdgeWithPrefix',
    value: function hasEdgeWithPrefix(prefix) {
      if (prefix.length === 0) {
        return false;
      }

      if (!this._getEdge(prefix[0])) {
        return false;
      }

      return _util2.default.startsWith(this._getEdge(prefix[0]), prefix);
    }
  }, {
    key: '_connectByEdge',
    value: function _connectByEdge(childToConnect, edge) {
      if (!edge) {
        throw new Error('Cannot connect by empty edge');
      }

      var leadingChar = edge[0];

      if (this._getEdge(leadingChar)) {
        throw new Error('An edge with the leading character already exists');
      }

      this.childrenByLeadingChar[leadingChar] = childToConnect;
      this.edgesByLeadingChar[leadingChar] = edge;
      childToConnect.parent = this;

      return childToConnect;
    }
  }, {
    key: 'add',
    value: function add(str, labelsForLeaf) {
      var result = this._matchUntilMismatch(str);
      var node = result.lastNode;
      if (result.remainingPattern.length > 0) {
        node = node._addChild(result.remainingPattern);
      }

      _util2.default.each(labelsForLeaf, function (label) {
        node.labels[label] = label;
      });
    }
  }, {
    key: '_addChild',
    value: function _addChild(pattern) {
      var leadingChar = pattern[0];
      var existingEdge = this._getEdge(leadingChar) || '';

      // Split the edge into the prefix and the rest
      var prefixLength = _util2.default.getLengthOfCommonPrefix(existingEdge, pattern);
      var prefix = existingEdge.slice(0, prefixLength);
      var edgeRemainder = existingEdge.slice(prefixLength);
      var patternRemainder = pattern.slice(prefixLength);

      if (prefix && !edgeRemainder) {
        throw new Error('tried to add child where edge already had prefix');
      }

      if (prefix) {
        // Disconnect the child on the edge
        var oldChild = this._getChild(leadingChar);
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

        newChild.parent = this;

        return newChild;
      }

      // If no shared prefix, connect the new node with a new edge
      if (patternRemainder) {
        return this._connectByEdge(new TrieNode(), patternRemainder);
      }

      // Return current node if no pattern left
      return this;
    }

    // Deletes this node from the tree and re-arranges
    // ancestors as needed to keep the trie compact

  }, {
    key: 'removeAndPrune',
    value: function removeAndPrune() {
      var parent = this.getParent();

      var parentChildren = parent.getChildren();

      if (parentChildren.length <= 2) {
        parent.disconnectChild(this);
      }

      parent.compactIfPossible();
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
      var depth = 0;
      var maxDepth = 0;

      if (this.isLeaf()) {
        return 0;
      }

      _util2.default.each(this.getChildren(), function (child) {
        depth = 1 + child.depth();
        maxDepth = Math.max(depth, maxDepth);
      });

      return maxDepth;
    }

    // Returns the number of nodes in the trie (counting root)

  }, {
    key: 'size',
    value: function size() {
      var total = 1;

      if (this.isLeaf()) {
        return total;
      }

      _util2.default.each(this.getChildren(), function (child) {
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
      var isLastChild = false;
      var index = 0;

      for (var c in this.edgesByLeadingChar) {
        isLastChild = index === Object.keys(this.childrenByLeadingChar).length - 1;
        var arrow = isLastChild ? '└' : '├';
        var childPrefix = '' + padding + (isLastChild ? ' ' : '|') + '  ';
        var child = this._getChild(c);
        var edge = this._getEdge(c);
        var labels = child.getLabels();
        var labelsText = labels.length > 0 ? ' [' + labels.join(', ') + ']' : '';
        var prettyPrintedChild = child.prettyPrint(childPrefix);
        lines.push('' + padding + arrow + '\u2500 ' + edge + ' ' + labelsText + prettyPrintedChild);
        index += 1;
      }
      return lines.join('\n');
    }
  }, {
    key: 'getLabels',
    value: function getLabels() {
      return this.constructor.getUniqueLabels([this]);
    }
  }, {
    key: 'hasLabel',
    value: function hasLabel(label) {
      return !!this.labels[label];
    }
  }, {
    key: 'getParent',
    value: function getParent() {
      return this.parent;
    }

    // Gets the edge which connects this node to it's parent

  }, {
    key: 'getParentEdge',
    value: function getParentEdge() {
      var parent = this.getParent();
      if (!parent) {
        return null;
      }

      for (var char in parent.edgesByLeadingChar) {
        if (parent._getChild(char) === this) {
          return parent.edgesByLeadingChar[char];
        }
      }

      return null;
    }

    // If this node has a lone child, collapse it into self to
    // keep trie compact

  }, {
    key: 'compactIfPossible',
    value: function compactIfPossible() {
      var children = this.getChildren();
      var parent = this.getParent();

      if (!parent) {
        return false;
      }

      if (children.length !== 1) {
        return false;
      }

      var loneChild = children[0];
      var loneChildEdge = loneChild.getParentEdge();
      this.disconnectChild(loneChild);

      // Append lone child edge to parent
      var parentEdge = this.getParentEdge();
      parent.edgesByLeadingChar[parentEdge[0]] = '' + parentEdge + loneChildEdge;

      // Absorb lone child's children
      this.childrenByLeadingChar = loneChild.childrenByLeadingChar;
      this.edgesByLeadingChar = loneChild.edgesByLeadingChar;

      // Update children parent pointers
      for (var child in this.getChildren()) {
        child.parent = this;
      }

      return true;
    }
  }, {
    key: 'disconnectChild',
    value: function disconnectChild(child) {
      var edge = child.getParentEdge();

      if (!edge) {
        throw new Error('child is not connected to parent');
      }

      delete this.childrenByLeadingChar[edge[0]];
      delete this.edgesByLeadingChar[edge[0]];
      child.parent = null;
    }
  }], [{
    key: 'getUniqueLabels',
    value: function getUniqueLabels(nodes) {
      var labels = {};

      _util2.default.each(nodes, function (node) {
        _util2.default.each(node.labels, function (value, label) {
          labels[label] = value;
        });
      });

      return Object.values(labels);
    }
  }]);

  return TrieNode;
}();

exports.default = TrieNode;