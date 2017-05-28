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
    const stringID = this.nextStringID;
    for (const suffix of util.suffixesOf(string)) {
      super.add(suffix, [stringID]);  
    }
    this.strings[stringID] = string;
    this.nextStringID += 1;
    return stringID;
  }
  
  getMatchingStringIDs(pattern) {
    const locus = this.match(pattern);
    
    if (!locus) {
      return [];
    }
    
    return TrieNode.getUniqueLabels(locus.leaves());
  }
  
  getMatchingStrings(pattern) {
    const stringIDs = this.getMatchingStringIDs(pattern);
    return stringIDs.map((stringID) => (this.getStringByID(stringID)));
  }
  
  getStringByID(stringID) {
    return this.strings['' + stringID];
  }
  
}

module.exports = SuffixTree;
