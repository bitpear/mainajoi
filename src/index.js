'use strict';

const fs = require('fs');

const {
  XmlDocument
} = require('xmldoc'),
  Joi = require('joi'),
  beautify = require('js-beautify').js_beautify;

const resolve = require('./strategies'),
  Database = require('./Database');

class MainaJoi {
  constructor({
    file,
    xml,
    options,
  }) {
    this._xml = xml || fs.readFileSync(file, 'utf8');
    this.options = Object.assign({}, options);
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

        default:
          db.addCustom(tag.name, r);
      }
    });

    return db;
  }

  generate() {

  }
}

module.exports = MainaJoi;

const m = new MainaJoi({
  file: './dbmodel.dbm',
  options: {},
});

const p = m._parse();
const cols = p.get('topic')
  .get('id');

console.log(cols);