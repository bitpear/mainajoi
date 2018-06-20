class Column {
  constructor(name) {
    this.name = name;
    this._props = new Map();
  }

  add(name, prop) {
    this._props.set(name, prop);
    return this;
  }

  get(base = {}) {
    return [...this._props.entries()]
      .reduce((main, [key, value]) => ({
        ...main,
        [key]: value,
      }), base);
  }

  getString(prefix = 'Joi') {
    return [...this._props.entries()]
      .reduce((main, [key, value]) => (main += value.value.getString()), prefix);
  }
}

module.exports = Column;