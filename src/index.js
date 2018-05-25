'use strict';

const fs = require('fs');
const { XmlDocument } = require('xmldoc');
const resolve = require('./strategies');

class MainaJoi {
  constructor({
    file,
    xml,
  }){
    /* this._strategies = {
      position: () => null,

      table: (t) => {
        const table = {
          name: t.attr.name,
        };

        t.eachChild((t) => {
          const r = this._resolve(t);
          if(!r){
            return;
          }

          console.log(r.joiString);

          if(table[t.name]){
            if(!Array.isArray(table[t.name])){
              const tmp = table[t.name];
              table[t.name] = [tmp];
            }
            table[t.name].push(r);
          } else {
            table[t.name] = r;
          }
        });

        return table;
      },

      column: (t) => {
        const column = {
          name: t.attr.name,
          notNull: 
            t.attr['not-null'] && t.attr['not-null'] === 'true' ? 
              true : false,
          joiString: '',
        };

        t.eachChild((t) => {
          column[t.name] = this._resolve(t);
          column.joiString += column[t.name].joiString;
        });

        return column;
      },

      type: (t) => {
        const type = {
          name: t.attr.name,
          length: parseInt(t.attr.length),
        };

        type.joiString = this._resolve(type, types, 'type');

        return type;
      },

      comment: (t) => {
        return {
          value: t.val,
          // TODO escape valore commento
          joiString: `.description('${t.val}')`,
        };
      },
    };
    
    this._baseTypes = {
      integer: ({name, length}) => 
        `.number().integer()${length > 0 ? `.max(${length})` : `` }`,
      text: ({name, length}) => 
        `.string()${length > 0 ? `.max(${length})` : `` }`,
      bool: ({name}) => 
        `.boolean()`,
      date: ({name}) => 
        `.date()`,

    }

    this._typeStrategies = {
      ...this._baseTypes,
      bigserial: this._baseTypes.integer,
      timestamp: this._baseTypes.integer,
      bigint: this._baseTypes.integer,
      //integer: this._baseTypes.integer,
      varchar: this._baseTypes.text,
      //text: this._baseTypes.string,
      //bool: this._baseTypes.bool,
      //date: this._baseTypes.date,
    };
 */
    this._xml = xml || fs.readFileSync(file, 'utf8');
  }

  /*_resolve(t, strategies = this._strategies, type = 'tag'){
    return (
      strategies[t.name] || 
      (() => console.log(`${type} ${t.name} not exists`))
    )(t);
  }*/



  _parse(){
    const parsed = new XmlDocument(this._xml);
    //console.log(parsed);

    parsed.eachChild((t) => {
      console.log(JSON.stringify(resolve(t), null, 2))
    });
  }

  generate(){

  }
}

module.exports = MainaJoi;

const m = new MainaJoi({file: './dbmodel.dbm'});
m._parse();