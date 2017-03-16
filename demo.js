var Trie = require('./lib/Trie');

var strings = [
  'abcdef',
  'abcxyz',
  'axyz'
];

var trie = new Trie(strings);

console.log('Strings: \n ', strings.join('\n  '));

console.log('\nTrie:')
console.log(trie.prettyPrint());