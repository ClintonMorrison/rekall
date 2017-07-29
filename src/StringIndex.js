import util from './util';
import SuffixTree from './SuffixTree';

class StringIndex {
  constructor() {
    this.suffixTree = new SuffixTree();

    this.findOne = this.getFindOneQueryBuilder();
    this.findAll = this.getFindAllQueryBuilder();
  }

  _getIDsWhereStringEquals(pattern) {
    const processedPattern = `^${this.constructor._encode(pattern)}$`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  _getIDsWhereStringContains(pattern) {
    const processedPattern = this.constructor._encode(pattern);
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  _getIDsWhereStringStartsWith(pattern) {
    const processedPattern = `^${this.constructor._encode(pattern)}`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  _getIDsWhereStringEndsWith(pattern) {
    const processedPattern = `${this.constructor._encode(pattern)}$`;
    return this.suffixTree.getMatchingStringIDs(processedPattern);
  }

  add(id, string) {
    this.suffixTree.add(id, `^${this.constructor._encode(string)}$`);
  }

  getFindOneQueryBuilder(processResultsCallback) {
    return {
      thatEquals: (pattern) =>
        util.getFirstElement(this._getIDsWhereStringEquals(pattern)),

      thatContains: (pattern) =>
        util.getFirstElement(this._getIDsWhereStringContains(pattern)),

      thatStartsWith: (pattern) =>
        util.getFirstElement(this._getIDsWhereStringStartsWith(pattern)),

      thatEndsWith: (pattern) =>
        util.getFirstElement(this._getIDsWhereStringEndsWith(pattern))
    };
  }

  getFindAllQueryBuilder(processResultsCallback) {
    return {
      thatEqual: (pattern) =>
        (this._getIDsWhereStringEquals(pattern)),

      thatContain: (pattern) =>
        (this._getIDsWhereStringContains(pattern)),

      thatStartWith: (pattern) =>
        (this._getIDsWhereStringStartsWith(pattern)),

      thatEndWith: (pattern) =>
        (this._getIDsWhereStringEndsWith(pattern))
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
