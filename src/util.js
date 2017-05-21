'use strict';

/**
 * Checks if string "a" starts with string "b"
 *
 */
const startsWith = function (a, b) {
  return a.indexOf(b) == 0;
};

const suffixesOf = function (str) {
  const suffixes = [];
  let i;
  
  for (i = 0; i < str.length; i++) {
    suffixes.push(str.slice(i));
  }
  
  return suffixes.sort();
};

const each = function(iterable, callback) {
  if (!iterable || !callback) {
    return;
  }
  
  if (Array.isArray(iterable)) {
    _eachInArray(iterable, callback)
  } else if (typeof iterable === 'string') {
    _eachInArray(iterable.split(''), callback)
  } else if (typeof iterable === 'object') {
    _eachInObject(iterable, callback)
  }
};

const _eachInArray = function (array, callback) {
  let i;
  
  for (i = 0; i < array.length; i++) {
    callback(array[i], i);
  };
};

const _eachInObject = function (object, callback) {
  const keys = Object.keys(object);
  let i;
  let key;
  
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
