# rekall
A suffix tree backed full text index for strings and objects, written in JavaScript.

This library is still a work in progress and is not remotely close to being done.

Here's an example of how it might work:
```javascript
const rekall = require('rekall');


// String index
var fruits = rekall.stringIndex();
fruits.add(1, 'Apple');
fruits.add(2, 'Banana');
fruits.add(3, 'Orange');
fruits.add(4, 'Watermelon');

fruits
  .findAll
  .caseInsensitive
  .thatContain('a'); // returns [1, 2, 3]

fruits
  .findOne
  .thatStartsWith('Water'); // returns 4


// Object index
var starships = rekall.objectIndex();
starships.add(123, {
  'name':     'USS Enterprise',
  'registry': 'NCC-1701',
  'class':    'Constitution',
  'captain':  'James T. Kirk'
});

starships.add(456, {
  'name':     'USS Enterprise',
  'registry': 'NCC-1701-D',
  'class':    'Galaxy',
  'captain':  'Jean-Luc Picard'
});

starships
  .findOne
  .where('captain')
  .contains('Luc'); // returns 123

starships
  .findAll
  .where('name')
  .contains('Enterprise'); // returns [123, 456]

starships
  .findAll
  .where('class')
  .is('Galaxy'); // returns [456]

```
