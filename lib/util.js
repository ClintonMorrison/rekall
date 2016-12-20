'use strict';

/**
 * Checks if string "a" starts with string "b"
 *
 */
var startsWith = function (a, b) {
  return a.indexOf(b) == 0;
};

var suffixesOf = function (str) {
  var suffixes = [];
  var i;
  
  for (i = 0; i < str.length; i++) {
    suffixes.push(str.slice(i));
  }
  
  return suffixes.sort();
}


module.exports = {
  startsWith: startsWith,
  suffixesOf: suffixesOf
};
