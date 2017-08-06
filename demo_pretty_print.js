'use strict';

const StringIndex = require('./lib/StringIndex');

const stringIndex = new StringIndex();
stringIndex.add(1, '123');
stringIndex.add(2, '234');
stringIndex.add(3, '345');

console.log(stringIndex.suffixTree.prettyPrint());
