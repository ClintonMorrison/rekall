'use strict';

var _SuffixTree = require('./SuffixTree');

var _SuffixTree2 = _interopRequireDefault(_SuffixTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rekall = {
  objectIndex: function objectIndex() {},

  stringIndex: function stringIndex() {
    return new SuffixTree([]);
  }
}; // import util from './util'


module.exports = Rekall;