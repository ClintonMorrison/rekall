'use strict';

/**
 * Checks if string "a" starts with string "b"
 *
 */
var startsWith = function (a, b) {
  return a.indexOf(b) == 0;
};


module.exports = {
  startsWith: startsWith
};
