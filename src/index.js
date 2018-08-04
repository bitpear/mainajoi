'use strict';

const fs = require('fs');

const {
  XmlDocument
} = require('xmldoc');

const resolve = require('./strategies'),
  Database = require('./lib/Database');

class MainaJoi {
  constructor({
    file,
    xml,
    options,
  }) {
    this._xml = xml || fs.readFileSync(file, 'utf8');
    this._options = Object.assign({}, options);
    this._db = this._parse();
  }

  get(...args) {
    return this._db.get(...args);
  }

  _parse() {
    const xmlParsed = new XmlDocument(this._xml),
      db = new Database(),
      ret = {};

    xmlParsed.eachChild((tag) => {
      const r = resolve({
        tag,
        db,
      });

      if (!r) {
        return;
      }

      switch (tag.name) {
        case 'database':
          db.setName(r);
          break;

        case 'table':
          db.add(r);
          break;

        case 'relationship':
          r.forEach(rel => db.addRel(rel));
          break;

        default:
          console.error('???');
      }
    });

    return db;
  }
}

module.exports = MainaJoi;