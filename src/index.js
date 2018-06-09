'use strict';

const fs = require('fs');

const {
  XmlDocument
} = require('xmldoc'),
  Joi = require('joi'),
  beautify = require('js-beautify').js_beautify;

const resolve = require('./strategies'),
  Table = require('./Table');

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
      parsed = {},
      ret = {};

    xmlParsed.eachChild((t) => {
      const r = resolve(t);
      if (!r) {
        return;
      }

      (
        parsed[t.name] = parsed[t.name] || []
      ).push(r);
    });



    /*
      gestire description tabella
      gestire Joi.object per tabelle
    */
    parsed.table.forEach((table) => {
      ret[table.name] = new Table(table);
    });



    // TODO: da rivedere export
    /*if(this.options.export){
      return beautify(
        JSON.stringify(ret, null, 2).replace(/(".*?":[\s]*)"(.*?)"(,?\n)/g, '$1: $2$3'), {
          indent_size: 2,
        }
      );
    } else {
      return ret;
    }*/


    /*const jsjs = `{
      ${a.join(",\n")}
    }
    `;*/

    //console.log())

    return ret;
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
console.log(Object.keys(p.topic.get()));