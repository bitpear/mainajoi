'use strict';

const types = require('./types');

function resolve(t, strategies = tagStrategies, type = 'tag', tp /*parent*/ ) {
  return (strategies[t.name] || strategies['_default'])(t, tp);
}

const Empty = () => null;

const tagStrategies = {
  _default: (t) => {
    console.error(`${t.name} not exists`)
  },

  position: Empty,
  index: Empty,
  role: Empty,
  schema: Empty,
  dbmodel: Empty,
  constraint: Empty,
  relationship: Empty, // non gestisco visto che i dati eventualmente vengono presi da altre tabelle.
  customidxs: Empty, // da gestire? vengono da altre tabelle

  database: t => t.attr.name,

  customidxs: (t) => {
    switch (t.attr['object-type']) {
      case 'column':
        console.log(t);

        return null;
        break;

      default:
        return null;
    }
  },

  table: (t) => {
    const table = {
      name: t.attr.name,
    };

    t.eachChild((t) => {
      const r = resolve(t);
      if (!r) {
        return;
      }

      (
        table[t.name] = table[t.name] || []
      ).push(r);
    });

    return table;
  },

  column: (t) => {
    const column = {
      name: t.attr.name,
      value: {
        getString: (prefix = 'Joi') => {
          t.eachChild((tc) => {
            const ct = resolve(tc, undefined, undefined, t);
            prefix += ct.value.getString();
          });

          return prefix;
        },

        get: (base = {}) => {
          t.eachChild((tc) => {
            base[tc.name] = resolve(tc, undefined, undefined, t);
          });

          return base;
        },
      },
    };

    return column;
  },

  type: (t, tp) => {
    const type = {
      name: t.attr.name,
      length: parseInt(t.attr.length),
      notNull: tp.attr['not-null'] && tp.attr['not-null'] === 'true' ?
        true : false,
      defaultValue: tp.attr['default-value'],
    };

    type.value = resolve(type, types, 'type');

    return type;
  },

  comment: (t) => {
    return {
      value: {
        getString: () => `.description('${t.val}')`,
        get: j => j.description(t.val),
      },
      _value: t.val,
    };
  },
};

module.exports = resolve;