const types = require('./types');

function resolve(t, strategies = tagStrategies, type = 'tag'){
  return (strategies[t.name] || strategies['_default'])(t);
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
      notNull: 
        t.attr['not-null'] && t.attr['not-null'] === 'true' ? 
          true : false,
    };

    t.eachChild((tc) => {
      let ct = column[tc.name] = resolve(tc);
      column.joiString += ct.value.joiString;

      if(!column.notNull){
        ct.value.joiString = `${ct.value.joiString}.allow(null)`;
        let cb = ct.value.get;
        ct.value.get = (j) => cb(j.allow(null));
      }
    });

    return column;
  },

  type: (t) => {
    const type = {
      name: t.attr.name,
      length: parseInt(t.attr.length),
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