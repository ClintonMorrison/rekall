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
};

// TODO: add support for strings (iterating by char)
var each = function(iterable, callback) {
  if (!iterable || !callback) {
    return;
  }
  
  (Array.isArray(iterable)) ? _eachInArray(iterable, callback) : _eachInObject(iterable, callback);
};

var _eachInArray = function (array, callback) {
  var i;
  
  for (i = 0; i < array.length; i++) {
    callback(array[i], i);
  };
};

var _eachInObject = function (object, callback) {
  var keys = Object.keys(object);
  var i;
  var key;
  
  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    callback(object[key], key);
  };
};



module.exports = {
  startsWith: startsWith,
  suffixesOf: suffixesOf,
  each: each
};
