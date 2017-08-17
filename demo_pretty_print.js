'use strict';

const StringIndex = require('./lib/StringIndex');

const stringIndex = new StringIndex();

//console.log(stringIndex.suffixTree.prettyPrint());

stringIndex.add(1, 'ABCD');

//console.log(stringIndex.suffixTree.prettyPrint());

stringIndex.add(2, 'BCDE');
console.log(stringIndex.suffixTree.prettyPrint());
