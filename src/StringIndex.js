import util from './util';
import SuffixTree from './SuffixTree';

class StringIndex {
  constructor() {
    this.suffixTree = new SuffixTree();

    this.findOne = this.getQueryBuilder(util.getFirstElement);
    this.findAll = this.getQueryBuilder((results) => results);
  }

  _getIDsWhereStringEquals(pattern) {
    const processedPattern = `^${this.constructor._encode(pattern)}$`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  _getIDsWhereStringContains(pattern) {
    const processedPattern = `${this.constructor._encode(pattern)}`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  _getIDsWhereStringEndsWith(pattern) {
    const processedPattern = `${this.constructor._encode(pattern)}$`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  _getIDsWhereStringStartsWith(pattern) {
    const processedPattern = this.constructor._encode(pattern);
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  // TODO: add needs to take a string ID
  add(id, string) {
    this.suffixTree.add(id, `^${this.constructor._encode(string)}$`);
  }

  getQueryBuilder(processResultsCallback) {
    return {
      thatEquals: (pattern) =>
        processResultsCallback(this._getIDsWhereStringEquals(pattern)),

      thatContains: (pattern) =>
        processResultsCallback(this._getIDsWhereStringContains(pattern)),

      thatStartsWith: (pattern) =>
        processResultsCallback(this._getIDsWhereStringStartsWith(pattern)),

      thatEndsWith: (pattern) =>
        processResultsCallback(this._getIDsWhereStringEndsWith(pattern))
    };
  }

  static _encode(string) {
    return string
      .replace(/\$/g, '\\$')
      .replace(/\^/g, '\\^');
  }

  static _decode(string) {
    return string
      .replace(/\\\$/, '$')
      .replace(/\\\^/, '^');
  }
}

module.exports = StringIndex;
