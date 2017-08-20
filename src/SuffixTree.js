'use strict';

import util from './util';
import TrieNode from './TrieNode';

class SuffixTree extends TrieNode {
  constructor() {
    super(null);
    this.strings = {};
  }

  add(id, string) {
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
    return this
      .getMatchingStringIDs(pattern)
      .map(stringID => this.getStringByID(stringID));
  }

  getStringByID(stringID) {
    return this.strings['' + stringID];
  }

  removeStringByID(stringID) {
    const string = this.getStringByID(stringID);
    const locus = this.match(string);

    if (!locus || !locus.isLeaf() || !locus.labels[stringID]) {
      throw new Error('string not in trie, it may have aleady been deleted');
    }



  }

}

module.exports = SuffixTree;
