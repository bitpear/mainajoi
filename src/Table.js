const Joi = require('joi');

class Table {
  constructor(table) {
    this._table = table;
  }

  _reduceColumns(cb, base) {
    return this._table.column.reduce(cb, base);
  }

  get(j = Joi) {
    return this._reduceColumns((acc, obj) => ({
      ...acc,
      [obj.name]: obj.value.get().type.value.get(j),
    }), {});
  }

  getSchema(j = Joi) {
    return this._reduceColumns((acc, obj) => {
      return acc.append({
        [obj.name]: obj.value.get().type.value.get(j),
      });
    }, Joi.object());
  }

  getString() {
    return this._reduceColumns((acc, obj) => ({
      ...acc,
      [obj.name]: obj.value.getString(),
    }), {});
  }
}


module.exports = Table;