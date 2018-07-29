'use strict';

const rekall = require('./lib/rekall');

let fruits = rekall.stringIndex({ caseInsensitive: true });
let result;

// Add strings to index
fruits.add(1, 'Apple');
fruits.add(2, 'Banana');
fruits.add(3, 'Orange');
fruits.add(4, 'Watermelon');

console.log(fruits.suffixTree.prettyPrint());

// Searching the index
result = fruits
  .findAll
  .thatContain('a'); // returns [1, 2, 3, 4]
console.log('fruits that contain "a": ', result);

result = fruits
  .findOne
  .thatStartsWith('Water'); // returns 4
console.log('fruits that start with "Water": ', result);

result = fruits
  .findOne
  .thatEquals('Appl'); // returns null
console.log('fruits that equal "Appl": ', result);