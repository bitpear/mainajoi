'use strict';

const Type = require('./Type'),
  Table = require('./Table'),
  Column = require('./Column');

let _db = null;

/*function resolve(t, strategies = tagStrategies, type = 'tag', tp ) {
  return (strategies[t.name] || strategies['_default'])(t, tp);
}*/

function resolve({
  tag,
  strategies = tagStrategies,
  type = 'tag',
  tagParent,
  db = _db,
}) {
  if (db && !_db) {
    _db = db;
  }

  return (strategies[tag.name] || strategies['_default'])({
    tag,
    tagParent,
    db,
  });
}

const Empty = () => null,
  getTableName = data => data.split('.')[1].replace(/"(.*?)"/, '$1');

const tagStrategies = {
  position: Empty,
  index: Empty,
  role: Empty,
  schema: Empty,
  object: Empty,
  dbmodel: Empty,
  customidxs: Empty,

  _default: ({
    tag,
  }) => {
    console.error(`${tag.name} not exists`)
  },

  //relationship: Empty, // non gestisco visto che i dati eventualmente vengono presi da altre tabelle.

  database: ({
    tag,
  }) => tag.attr.name,


  // TODO: finire gestione indice primario per generazione relationship
  constraint: ({
    tag,
    db,
  }) => {
    tag.eachChild((tagChild) => {
      const r = resolve({
        tag: tagChild,
      });

      if (!r) {
        return;
      }

      //console.log(r);
    });
  },

  columns: ({
    tag,
  }) => {
    switch (tag.attr['ref-type']) {
      case 'src-columns':
        return {
          sc: tag.attr.names,
        };
      default:
        return null;
    };
  },

  /*customidxs: (t) => {
    switch (t.attr['object-type']) {
      case 'column':
        //console.log(t);
        t.eachChild((tc) => {
          const r = resolve(tc);
          if (!r) {
            return null;
          }
        });

        return null;
        break;

      default:
        return null;
    }
  },*/

  relationship: ({
    tag,
    db,
  }) => {
    const {
      type,
    } = tag.attr;

    const src_table = getTableName(tag.attr['src-table']),
      dst_table = getTableName(tag.attr['dst-table']);

    switch (type) {
      case 'rel11':
        //console.log('src', db.get(src_table), 'dst', dst_table, db.get(dst_table));
        const src_col_pattern = tag.attr['src-col-pattern'].
        //console.log(t.attr);
        break;

      case 'rel1n':
        //console.log(t.attr);
        break;

      case 'relnn':
        //console.log(t.attr);
        break;


      default:
        throw new Error(`Relationship type not recognized: ${type}`);
    }

    return null;
  },

  table: ({
    tag,
  }) => {
    const table = new Table(tag.attr.name);

    tag.eachChild((tagChild) => {
      const r = resolve({
        tag: tagChild,
      });

      if (!r) {
        return;
      }

      table.add(r);
    });

    return table;
  },

  column: ({
    tag,
  }) => {
    const column = new Column(tag.attr.name);

    tag.eachChild((tagChild) => {
      const prop = resolve({
        tag: tagChild,
        tagParent: tag,
      });

      column.add(tagChild.name, prop);
    });

    /*const column = {
      name: tag.attr.name,
      value: {
        getString: (prefix = 'Joi') => {
          tag.eachChild((tagChild) => {
            const ct = resolve({
              tag: tagChild,
              tagParent: tag,
            });
            prefix += ct.value.getString();
          });

          return prefix;
        },

        get: (base = {}) => {
          tag.eachChild((tagChild) => {
            base[tagChild.name] = resolve({
              tag: tagChild,
              tagParent: tag,
            });
          });

          console.log('base', base);
          return base;
        },
      },
    };*/

    return column;
  },

  type: ({
    tag,
    tagParent,
  }) => {

    const type = new Type({
      name: tag.attr.name,
      length: parseInt(tag.attr.length),
      notNull: tagParent.attr['not-null'] && tagParent.attr['not-null'] === 'true' ?
        true : false,
      defaultValue: tagParent.attr['default-value'],
    });

    type.set(resolve({
      tag: type,
      strategies: Type.types,
      type: 'type',
    }));

    /*const type = {
      name: tag.attr.name,
      length: parseInt(tag.attr.length),
      notNull: tagParent.attr['not-null'] && tagParent.attr['not-null'] === 'true' ?
        true : false,
      defaultValue: tagParent.attr['default-value'],
    };

    type.value = ;*/

    return type;
  },

  comment: ({
    tag,
  }) => {
    return {
      value: {
        getString: () => `.description('${tag.val}')`,
        get: j => j.description(tag.val),
      },
      _value: tag.val,
    };
  },
};

module.exports = resolve;