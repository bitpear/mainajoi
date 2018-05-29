'use strict';

const fs = require('fs');

const { XmlDocument } = require('xmldoc'),
  beautify = require('js-beautify').js_beautify;

const resolve = require('./strategies');

class MainaJoi {
  constructor({
    file,
    xml,
    options,
  }){
    this._xml = xml || fs.readFileSync(file, 'utf8');
    this.options = Object.assign({
      export: true,
    }, options);
  }

  _parse(){
    const xmlParsed = new XmlDocument(this._xml),
      parsed = {},
      ret = {};

    xmlParsed.eachChild((t) => {
      const r = resolve(t);
      if(!r){
        return;
      }

      if(parsed[t.name]){
        parsed[t.name].push(r);
      } else {
        parsed[t.name] = [r];
      }
    });

    /*
      gestire description tabella
      gestire Joi.object per tabelle
    */
    const a = [];
    parsed.table.forEach((table) => {
      let joiString = [];
      ret[table.name] = table.column.reduce((a, o) => {
        if(this.options.export){
          // https://www.npmjs.com/package/js-beautify
          joiString.push(` "${o.name}": ${o.joiString}`);
        } else {
          a[o.name] = o.type.value.get;
        }
        return a;
      }, {});
      // shitty.
      a.push(`"${table.name}": Joi.object().keys({${joiString.join(",\n")}})`);
    });
    const jsjs = `{
      ${a.join(",\n")}
    }
    `;

    console.log(beautify(jsjs, { indent_size: 2 }))
  }

  generate(){

  }
}

module.exports = MainaJoi;

const m = new MainaJoi({file: './dbmodel.dbm'});
m._parse();