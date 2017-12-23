'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectQuery = function () {
  function ObjectQuery(resultType, executeHandler) {
    _classCallCheck(this, ObjectQuery);

    this.resultType = resultType;
    this.clauses = [];
    this.executeHandler = executeHandler;
  }

  _createClass(ObjectQuery, [{
    key: 'where',
    value: function where(field) {
      this.incompleteClause.field = field;
    }
  }, {
    key: 'contains',
    value: function contains(value) {
      this.incompleteClause.operation = 'CONTAINS';
      this.incompleteClause.value = value;
      this._validateAndPushIncompleteClause();
    }
  }, {
    key: 'equals',
    value: function equals(value) {
      this.incompleteClause.operation = 'EQUALS';
      this.incompleteClause.value = value;
      this._validateAndPushIncompleteClause();
    }
  }, {
    key: 'execute',
    value: function execute() {
      this.executeHandler(this.clauses);
    }
  }, {
    key: '_validateAndPushIncompleteClause',
    value: function _validateAndPushIncompleteClause() {
      var fields = ['field', 'operation', 'value'];
      if (_util2.default.hasKeys(this.incompleteClause, fields)) {
        this.clauses.push(this.incompleteClause);
        this.incompleteClause = {};
      }
    }
  }]);

  return ObjectQuery;
}();

module.exports = ObjectQuery;