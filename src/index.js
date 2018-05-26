'use strict';

const fs = require('fs');
const { XmlDocument } = require('xmldoc');
const resolve = require('./strategies');

class MainaJoi {
  constructor({
    file,
    xml,
    options,
  }){
    this._xml = xml || fs.readFileSync(file, 'utf8');
    this.options = Object.assign({
      export: false,
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

      // TODO: trasformare in funzione
      if(parsed[t.name]){
        if(!Array.isArray(parsed[t.name])){
          const tmp = parsed[t.name];
          parsed[t.name] = [tmp];
        }
        parsed[t.name].push(r);
      } else {
        parsed[t.name] = r;
      }
    });

    /*
      gestire description tabella
      gestire Joi.object per tabelle
    */
    (Array.isArray(parsed.table) ? parsed.table : [parsed.table]).forEach((table) => {
      ret[table.name] = (Array.isArray(table.column) ? table.column : [table.column]).reduce((a, o) => {
        a[o.name] = this.options.export ? o.type.value.joiString : o.type.value.get;
        return a;
      }, {});
    });


    console.log(ret)
  }

  generate(){

  }
}

module.exports = MainaJoi;

const m = new MainaJoi({file: './dbmodel.dbm'});
m._parse();