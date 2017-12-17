'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _TrieNode2 = require('./TrieNode');

var _TrieNode3 = _interopRequireDefault(_TrieNode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SuffixTree = function (_TrieNode) {
  _inherits(SuffixTree, _TrieNode);

  function SuffixTree() {
    _classCallCheck(this, SuffixTree);

    var _this = _possibleConstructorReturn(this, (SuffixTree.__proto__ || Object.getPrototypeOf(SuffixTree)).call(this, null));

    _this.strings = {};
    return _this;
  }

  _createClass(SuffixTree, [{
    key: 'add',
    value: function add(id, string) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _util2.default.suffixesOf(string)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var suffix = _step.value;

          _get(SuffixTree.prototype.__proto__ || Object.getPrototypeOf(SuffixTree.prototype), 'add', this).call(this, suffix, [id]);
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

      this.strings[id] = string;
    }
  }, {
    key: 'getMatchingStringIDs',
    value: function getMatchingStringIDs(pattern) {
      var locus = this.match(pattern);

      if (!locus) {
        return [];
      }

      return _TrieNode3.default.getUniqueLabels(locus.leaves());
    }
  }, {
    key: 'getMatchingStrings',
    value: function getMatchingStrings(pattern) {
      var _this2 = this;

      return this.getMatchingStringIDs(pattern).map(function (stringID) {
        return _this2.getStringByID(stringID);
      });
    }
  }, {
    key: 'getStringByID',
    value: function getStringByID(stringID) {
      return this.strings[stringID];
    }
  }, {
    key: 'removeStringByID',
    value: function removeStringByID(stringID) {
      var string = this.getStringByID(stringID);
      var locus = this.match(string);

      if (!locus || !locus.isLeaf() || !locus.hasLabel(stringID)) {
        throw new Error('string not in trie, it may have aleady been deleted');
      }

      // The leaf only needs to be removed if this is the only string associated with it
      if (locus.getLabels().length === 1) {
        locus.removeAndPrune();
      }

      delete this.strings[stringID];
    }
  }]);

  return SuffixTree;
}(_TrieNode3.default);

module.exports = SuffixTree;