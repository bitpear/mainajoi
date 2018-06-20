class Database {
  constructor(name = null) {
    this._tables = new Map();
    this._name = name;
    this._sc = null;
  }

  setName(name) {
    this._name = name;
    return this;
  }

  add(table) {
    this._tables.set(table.name, table);
    return this;
  }

  addCustom(...args) {
    console.log(args);
    // TODO: completare funzione eventualmente ci siano altri tag da gestire
    return this;
  }

  get(tableName) {
    return this._tables.get(tableName);
  }
}

module.exports = Database;