import util from './util';

const augmentWithQueryBuilder = function (object, executeHandler) {
  object.findOne = new ObjectQuery('ONE', executeHandler);
  object.findAll = new ObjectQuery('ALL', executeHandler);

}

class ObjectQuery {
  constructor(resultType, executeHandler) {
    this.resultType = resultType;
    const incompleteClause = {};
    this.clauses = [];
    this.executeHandler = executeHandler;
  }

  where(field) {
      this.incompleteClause.field = field;
  }

  contains(value) {
    this.incompleteClause.operation = 'CONTAINS';
    this.incompleteClause.value = value;
    this._validateAndPushIncompleteClause();
  }

  equals(value) {
    this.incompleteClause.operation = 'EQUALS'
    this.incompleteClause.value = value;
    this._validateAndPushIncompleteClause();
  }

  execute() {
    this.executeHandler(this.clauses);
  }

  _validateAndPushIncompleteClause() {
    const fields = ['field', 'operation', 'value'];
    if (util.hasKeys(this.incompleteClause, fields)) {
      this.clauses.push(this.incompleteClause);
      this.incompleteClause = {};
    }
  }
}

module.exports = ObjectQuery;
