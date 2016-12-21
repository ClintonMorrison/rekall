# rekall
A full text index for JavaScript objects. 

This library is still a work in progress and is not remotely close to being done. 

Here's an example of how it might work:
```javascript
rekall = require('rekall');

var starships = rekall.objectIndex();

starships.add(123, {
  'name':     'USS Enterprise',
  'registry': 'NCC-1701',
  'class':    'Constituion',
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