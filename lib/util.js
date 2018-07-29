'use strict';

/**
 * Checks if string "a" starts with string "b"
 *
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var startsWith = function startsWith(a, b) {
  return a.indexOf(b) === 0;
};

var suffixesOf = function suffixesOf(str) {
  var suffixes = [];
  var i = void 0;

  for (i = 0; i < str.length; i++) {
    suffixes.push(str.slice(i));
  }

  return suffixes.sort();
};

var getLengthOfCommonPrefix = function getLengthOfCommonPrefix(str1, str2) {
  var i = 0;
  var maxPrefixLength = Math.min(str1.length, str2.length);

  for (i = 0; i < maxPrefixLength; i++) {
    if (str1[i] !== str2[i]) {
      return i;
    }
  }

  return i;
};

var each = function each(iterable, callback) {
  if (!iterable || !callback) {
    return;
  }

  if (Array.isArray(iterable)) {
    _eachInArray(iterable, callback);
  } else if (typeof iterable === 'string') {
    _eachInArray(iterable.split(''), callback);
  } else if ((typeof iterable === 'undefined' ? 'undefined' : _typeof(iterable)) === 'object') {
    _eachInObject(iterable, callback);
  }
};

var _eachInArray = function _eachInArray(array, callback) {
  var i = void 0;

  for (i = 0; i < array.length; i++) {
    callback(array[i], i);
  }
};

var _eachInObject = function _eachInObject(object, callback) {
  var keys = Object.keys(object);
  var i = void 0;
  var key = void 0;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    callback(object[key], key);
  }
};

var hasKeys = function hasKeys(object, keys) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (typeof object[key] === 'undefined') {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
};

var getFirstElement = function getFirstElement(array) {
  if (array.length >= 1) {
    return array[0];
  }

  return null;
};

exports.default = {
  startsWith: startsWith,
  suffixesOf: suffixesOf,
  getLengthOfCommonPrefix: getLengthOfCommonPrefix,
  each: each,
  hasKeys: hasKeys,
  getFirstElement: getFirstElement
};