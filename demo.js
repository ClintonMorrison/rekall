'use strict';

const rekall = require('./lib/rekall');

let fruits = rekall.stringIndex({ caseInsensitive: true });

// Add strings to index
fruits.add(1, 'Apple');
fruits.add(2, 'Banana');
fruits.add(3, 'Orange');
fruits.add(4, 'Watermelon');

// Searching the index
fruits
  .findAll
  .thatContain('a'); // returns [1, 2, 3, 4]

fruits
  .findOne
  .thatStartsWith('Water'); // returns 4

fruits
  .findOne
  .thatEquals('Apple'); // returns null
