const Joi = require('joi');

class Table {
  constructor(table) {
    this._table = table;
    this._columnsByName = this._reduceColumns((acc, obj) => acc.set(obj.name, obj.value), new Map());
  }

  get name() {
    return this._table.name;
  }

  _reduceColumns(cb, base) {
    return this._table.column.reduce(cb, base);
  }

  get(name, j = Joi) {
    return name ? this._columnsByName
      .get(name) // column name (new Map)

      .get() // get children
      .type // type child
      .value // parsed value
      .get(j) : this.getAll(j);
  }

  getAll(j = Joi) {
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