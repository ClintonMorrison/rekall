'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _SuffixTree = require('./SuffixTree');

var _SuffixTree2 = _interopRequireDefault(_SuffixTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringIndex = function () {
  function StringIndex() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, StringIndex);

    this.suffixTree = new _SuffixTree2.default();
    this.options = options;

    this.findOne = this.getFindOneQueryBuilder();
    this.findAll = this.getFindAllQueryBuilder();
  }

  _createClass(StringIndex, [{
    key: '_getIDsWhereStringEquals',
    value: function _getIDsWhereStringEquals(pattern) {
      var processedPattern = '^' + this._encode(pattern) + '$';
      return this.suffixTree.getMatchingStringIDs(processedPattern);
    }
  }, {
    key: '_getIDsWhereStringContains',
    value: function _getIDsWhereStringContains(pattern) {
      var processedPattern = this._encode(pattern);
      return this.suffixTree.getMatchingStringIDs(processedPattern);
    }
  }, {
    key: '_getIDsWhereStringStartsWith',
    value: function _getIDsWhereStringStartsWith(pattern) {
      var processedPattern = '^' + this._encode(pattern);
      return this.suffixTree.getMatchingStringIDs(processedPattern);
    }
  }, {
    key: '_getIDsWhereStringEndsWith',
    value: function _getIDsWhereStringEndsWith(pattern) {
      var processedPattern = this._encode(pattern) + '$';
      return this.suffixTree.getMatchingStringIDs(processedPattern);
    }
  }, {
    key: 'add',
    value: function add(id, string) {
      this.suffixTree.add(id, '^' + this._encode(string) + '$');
    }
  }, {
    key: 'getFindOneQueryBuilder',
    value: function getFindOneQueryBuilder(processResultsCallback) {
      var _this = this;

      return {
        thatEquals: function thatEquals(pattern) {
          return _util2.default.getFirstElement(_this._getIDsWhereStringEquals(pattern));
        },

        thatContains: function thatContains(pattern) {
          return _util2.default.getFirstElement(_this._getIDsWhereStringContains(pattern));
        },

        thatStartsWith: function thatStartsWith(pattern) {
          return _util2.default.getFirstElement(_this._getIDsWhereStringStartsWith(pattern));
        },

        thatEndsWith: function thatEndsWith(pattern) {
          return _util2.default.getFirstElement(_this._getIDsWhereStringEndsWith(pattern));
        }
      };
    }
  }, {
    key: 'getFindAllQueryBuilder',
    value: function getFindAllQueryBuilder(processResultsCallback) {
      var _this2 = this;

      return {
        thatEqual: function thatEqual(pattern) {
          return _this2._getIDsWhereStringEquals(pattern);
        },

        thatContain: function thatContain(pattern) {
          return _this2._getIDsWhereStringContains(pattern);
        },

        thatStartWith: function thatStartWith(pattern) {
          return _this2._getIDsWhereStringStartsWith(pattern);
        },

        thatEndWith: function thatEndWith(pattern) {
          return _this2._getIDsWhereStringEndsWith(pattern);
        }
      };
    }
  }, {
    key: '_encode',
    value: function _encode(string) {
      var encoded = string.replace(/\$/g, '\\$').replace(/\^/g, '\\^');

      return this.options.caseInsensitive ? encoded.toLowerCase() : encoded;
    }
  }, {
    key: '_decode',
    value: function _decode(string) {
      return string.replace(/\\\$/, '$').replace(/\\\^/, '^');
    }
  }]);

  return StringIndex;
}();

module.exports = StringIndex;