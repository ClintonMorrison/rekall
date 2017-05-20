'use strict';

import util from './util';
import TrieNode from './TrieNode';

class SuffixTree extends TrieNode {
  constructor(strings) {
    super(null);
    this.nextStringID = 0;
    this.strings = {};
    
    for (let string of strings) {
      this.add(string);
    }
  }
  
  add(string) {
    super.add(string, this.nextStringID);
    this.strings[this.nextStringID] = string;
    this.nextStringID += 1;
  }
}

module.exports = SuffixTree;
