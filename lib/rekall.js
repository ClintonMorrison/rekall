'use strict';

var _StringIndex = require('./StringIndex');

var _StringIndex2 = _interopRequireDefault(_StringIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rekall = {
  objectIndex: function objectIndex() {},

  stringIndex: function stringIndex() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new _StringIndex2.default(options);
  }
};

module.exports = Rekall;