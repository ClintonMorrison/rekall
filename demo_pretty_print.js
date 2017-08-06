'use strict';

const StringIndex = require('./lib/StringIndex');

const stringIndex = new StringIndex();

console.log(stringIndex.suffixTree.prettyPrint());

stringIndex.add(1, 'A');
console.log(stringIndex.suffixTree.prettyPrint());

stringIndex.add(2, 'AB');
console.log(stringIndex.suffixTree.prettyPrint());

stringIndex.add(3, 'ABC');
console.log(stringIndex.suffixTree.prettyPrint());