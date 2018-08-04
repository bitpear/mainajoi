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

  addRel(rel) {
    this.get(rel.src).addRel(rel.dst, this.get(rel.dst));
    return this;
  }

  get(tableName) {
    return this._tables.get(tableName);
  }
}

module.exports = Database;