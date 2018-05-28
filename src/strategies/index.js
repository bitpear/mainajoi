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
      joiString: '',
      /*notNull: 
        t.attr['not-null'] && t.attr['not-null'] === 'true' ? 
          true : false,
      defaultValue: t.attr['default-value'],*/
    };

    t.eachChild((tc) => {
      let ct = column[tc.name] = resolve(tc, undefined, undefined, t);
      column.joiString += ct.value.joiString;



      /*if(!column.notNull){
        ct.value.joiString = `${ct.value.joiString}.allow(null)`;
        let cb = ct.value.get;
        ct.value.get = (j) => cb(j.allow(null));
      }

      if(column.defaultValue){
        ct.value.joiString = `${ct.value.joiString}.default(${column.defaultValue})`;
        let cb = ct.value.get;
        ct.value.get = (j) => cb(j.default(column.defaultValue));
      }*/
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