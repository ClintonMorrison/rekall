# rekall
A suffix tree backed full text index for strings, written in JavaScript.

This library is still a work in progress and is not remotely close to being done.

Here's an example of how it might work:
```javascript
const rekall = require('rekall');

// Create index
let fruits = rekall.stringIndex({ caseInsensitive: true });

// Add strings to index
fruits.add(1, 'Apple');
fruits.add(2, 'Banana');
fruits.add(3, 'Orange');
fruits.add(4, 'Watermelon');

// Searching the index
fruits
  .findAll
  .caseInsensitive
  .thatContain('a'); // returns [1, 2, 3]

fruits
  .findOne
  .thatStartsWith('Water'); // returns 4

// Removing strings
fruits.removeStringByID(2); // removes "Banana" from index

// Serializing and deserializing
const json = fruits.toJSON();
fruits = rekall.fromJSON(json);
```


## Upcoming Features
In the future this library will support indexing objects, and searching
for them based on values for specific keys.
