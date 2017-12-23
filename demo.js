'use strict';

const StringIndex = require('./lib/StringIndex');

const stringIndex = new StringIndex();

const strings = {
  1: 'cats cats',
  2: 'cats are very good.',
  3: 'Dogs dogs dogs',
  4: 'It was a catastrophe',
  '5': 'This is a test'
};

console.log('\n\nSTRINGS TO INDEX:')
for (const id in strings) {
  console.log('  ', id, '-->', strings[id]);
  stringIndex.add(id, strings[id]);
}

console.log('\n\nSTRINGS CONTAINING "CAT"');
console.log(stringIndex.findAll.thatContain('cat'));

console.log('\n\nNODES IN TRIE:', stringIndex.suffixTree.size());
