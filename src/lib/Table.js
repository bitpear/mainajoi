const Joi = require('joi');

class Table {
  constructor(name) {
    // TODO: rimuovere _columnsByName e lasciare una sola variabile
    this.name = name;
    this._columnsByName = new Map();
    this._column = [];
  }

  _reduceColumns(cb, base) {
    return this._column.reduce(cb, base);
  }

  add(column) {
    this._column.push(column);
    this._columnsByName.set(column.name, column.value);
    return this;
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
      [obj.name]: obj.get().type.get(j),
    }), {});
  }

  getSchema(j = Joi) {
    return this._reduceColumns((acc, obj) => {
      return acc.append({
        [obj.name]: obj.get().type.value.get(j),
      });
    }, Joi.object());
  }

  getString() {
    return this._reduceColumns((acc, obj) => ({
      ...acc,
      [obj.name]: obj.getString(),
    }), {});
  }
}


module.exports = Table;