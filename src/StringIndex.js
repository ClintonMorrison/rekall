import util from './util';
import SuffixTree from './SuffixTree';

class StringIndex {
  constructor() {
    this.suffixTree = new SuffixTree([]);
  }

  whereStringEquals() {
    const processedPattern = `^${this._encode(pattern)}$`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  whereStringContains(pattern) {
    const processedPattern = `^${this._encode(pattern)}`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  whereStringEndsWith(pattern) {
    const processedPattern = `^${this._encode(pattern)}`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  whereStringStartsWith(pattern) {
    const processedPattern = this._encode(pattern);
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  add(string) {
    this.suffixTree.add(`^${this._encode(pattern)}$`);
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
