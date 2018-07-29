import StringIndex from './StringIndex';

var Rekall = {
  objectIndex: function () {
  },

  stringIndex: function (options = {}) {
    return new StringIndex(options);
  }
};

module.exports = Rekall;
