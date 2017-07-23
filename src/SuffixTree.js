'use strict';

import util from './util';
import TrieNode from './TrieNode';

class SuffixTree extends TrieNode {
  constructor() {
    super(null);
    this.nextStringID = 0;
    this.strings = {};
  }

  add(id, string) {
    const stringID = this.nextStringID;
    for (const suffix of util.suffixesOf(string)) {
      super.add(suffix, [id]);
    }
    this.strings[id] = string;
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
