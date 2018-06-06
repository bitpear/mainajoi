'use strict';

const types = require('./types');

function resolve(t, strategies = tagStrategies, type = 'tag', tp){
  return (strategies[t.name] || strategies['_default'])(t, tp);
}

const tagStrategies = {
  _default: (t) => {
    console.error(`${t.name} not exists`)
  },

  position: () => null,
  index: () => null,
  role: () => null,
  schema: () => null,
  dbmodel: () => null,

  database: t => t.attr.name,

  table: (t) => {
    const table = {
      name: t.attr.name,
    };

    t.eachChild((t) => {
      const r = resolve(t);
      if(!r){
        return;
      }

      if(table[t.name]){
        table[t.name].push(r);
      } else {
        table[t.name] = [r];
      }
    });

    return table;
  },

  /*
    trasformare joiString in value.joiString
    aggiungere value.get
  */
  column: (t) => {
    const column = {
      name: t.attr.name,
      value: {
        joiString: '',
        get: () => {},
      },
      joiString: 'Joi',
    };

    t.eachChild((tc) => {
      let ct = column[tc.name] = resolve(tc, undefined, undefined, t);
      column.joiString += ct.value.joiString;
    });

    return column;
  },

  type: (t, tp) => {
    const type = {
      name: t.attr.name,
      length: parseInt(t.attr.length),
      notNull: 
        tp.attr['not-null'] && tp.attr['not-null'] === 'true' ? 
          true : false,
      defaultValue: tp.attr['default-value'],
    };

    type.value = resolve(type, types, 'type');

    return type;
  },

  comment: (t) => {
    return {
      value: {
        joiString: `.description('${t.val}')`,
        get: j => j.description(t.val),
      },
      _value: t.val,
    };
  },
};

module.exports = resolve;