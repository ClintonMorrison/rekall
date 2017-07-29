'use strict';

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _SuffixTree = require('./SuffixTree');

var _SuffixTree2 = _interopRequireDefault(_SuffixTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rekall = {
  objectIndex: function objectIndex() {},

  stringIndex: function stringIndex() {
    return new SuffixTree([]);
  }
};

module.exports = Rekall;