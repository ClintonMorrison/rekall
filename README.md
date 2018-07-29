# rekall
A suffix tree backed full text index for strings, written in JavaScript.

This library is still a work in progress and is not remotely close to being done.

Here's an example of how it might work:
```javascript
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
```


## Upcoming Features
In the future this library might support:
- deleting from the index
- serializing and deserializing the index
- indexing objects
- and searching for objects based on values for specific keys
