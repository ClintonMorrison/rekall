import util from './util';
import SuffixTree from './SuffixTree';

class StringIndex {
  constructor() {
    this.suffixTree = new SuffixTree([]);
  }

  whereStringEquals(pattern) {
    const processedPattern = `^${this.constructor._encode(pattern)}$`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  whereStringContains(pattern) {
    const processedPattern = `^${this.constructor._encode(pattern)}`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  whereStringEndsWith(pattern) {
    const processedPattern = `^${this.constructor._encode(pattern)}`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  whereStringStartsWith(pattern) {
    const processedPattern = this.constructor._encode(pattern);
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  // TODO: add needs to take a string ID
  add(string) {
    this.suffixTree.add(`^${this.constructor._encode(string)}$`);
  }

  static _encode(string) {
    return string
      .replace(/\$/g, '\\$')
      .replace(/\^/g, '\\^');
  }

  static _decode(string) {
    return string
      .replace(/\\\$/, '$')
      .replace(/\\\^/, '^')
      .slice(1, -1);
  }
}

module.exports = StringIndex;
