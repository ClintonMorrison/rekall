'use strict'

/**
 * Checks if string "a" starts with string "b"
 *
 */
const startsWith = (a, b) =>
  (a.indexOf(b) === 0)

const suffixesOf = function (str) {
  const suffixes = []
  let i

  for (i = 0; i < str.length; i++) {
    suffixes.push(str.slice(i))
  }

  return suffixes.sort()
}

const getLengthOfCommonPrefix = function (str1, str2) {
  let i = 0
  const maxPrefixLength = Math.min(str1.length, str2.length)

  for (i = 0; i < maxPrefixLength; i++) {
    if (str1[i] !== str2[i]) {
      return i
    }
  }

  return i
}

const each = function (iterable, callback) {
  if (!iterable || !callback) {
    return
  }

  if (Array.isArray(iterable)) {
    _eachInArray(iterable, callback)
  } else if (typeof iterable === 'string') {
    _eachInArray(iterable.split(''), callback)
  } else if (typeof iterable === 'object') {
    _eachInObject(iterable, callback)
  }
}

const _eachInArray = function (array, callback) {
  let i

  for (i = 0; i < array.length; i++) {
    callback(array[i], i)
  }
}

const _eachInObject = function (object, callback) {
  const keys = Object.keys(object)
  let i
  let key

  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    callback(object[key], key)
  }
}

const hasKeys = function (object, keys) {
  for (const key of keys) {
    if (typeof object[key] === 'undefined') {
      return false
    }
  }

  return true
}

const getFirstElement = function (array) {
  if (array.length >= 1) {
    return array[0]
  }

  return null
}

module.exports = {
  startsWith,
  suffixesOf,
  getLengthOfCommonPrefix,
  each,
  hasKeys,
  getFirstElement
}
