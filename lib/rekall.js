'use strict';

var _StringIndex = require('./StringIndex');

var _StringIndex2 = _interopRequireDefault(_StringIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rekall = {
  objectIndex: function objectIndex() {},

  stringIndex: function stringIndex() {
    return new _StringIndex2.default();
  }
};

module.exports = Rekall;