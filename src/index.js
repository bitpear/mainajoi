'use strict';

const fs = require('fs');

const { XmlDocument } = require('xmldoc'),
  Joi = require('joi'),
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

    console.log(this.options)
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
    //const a = [];
    parsed.table.forEach((table) => {
      let joiString = [];
      ret[table.name] = table.column.reduce((acc, obj) => {
        if(this.options.export){
          // https://www.npmjs.com/package/js-beautify
          //joiString.push(` "${o.name}": ${o.joiString}`);
          acc[obj.name] = obj.joiString;
        } else {
          acc.keys({
            [obj.name]: obj.type.value.get(Joi),
          });
          //acc[obj.name] = () => obj.type.value.get(Joi);
        }
        return acc;
      }, Joi.object({
        aaaaa: Joi.number()
      }));
      //console.log(ret)
      // shitty.
      //a.push(`"${table.name}": Joi.object().keys({${joiString.join(",\n")}})`);
    });

    if(this.options.export){
      return beautify(
        JSON.stringify(ret, null, 2).replace(/(".*?":[\s]*)"(.*?)"(,?\n)/g, '$1: $2$3'), {
          indent_size: 2,
        }
      );
    } else {
      return ret;
    }


    /*const jsjs = `{
      ${a.join(",\n")}
    }
    `;*/

    //console.log())
  }

  generate(){

  }
}

module.exports = MainaJoi;

const m = new MainaJoi({
  file: './dbmodel.dbm',
  options: {
    export: false,
  },
});

const p = m._parse();
console.log(p.user.schema());

//console.log(p.user.id())