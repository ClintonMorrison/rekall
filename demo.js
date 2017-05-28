'use strict';

var SuffixTree = require('./lib/SuffixTree');

var strings = [
  'abcdef',
  'abcxyz',
  'axyz'
];

var tree = new SuffixTree(['abcd', 'abcef']);
console.log(tree.prettyPrint());
console.log(tree.depth());
return;

/*
var tree = new SuffixTree(strings);

console.log('Strings: \n ', strings.join('\n  '));

console.log('\nSuffixTree:');
console.log(tree.prettyPrint());

var pattern = "ax"

console.log('\nMatch for P=' + pattern);
console.log(tree.getMatchingLabels(pattern));

let tree = new SuffixTree(['abcd', 'abcef']);
*/