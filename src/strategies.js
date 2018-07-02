'use strict';

const Type = require('./lib/Type'),
  Table = require('./lib/Table'),
  Column = require('./lib/Column');

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
  //object: Empty,
  dbmodel: Empty,
  //customidxs: Empty,
  constraint: Empty,

  _default: ({
    tag,
  }) => {
    console.error(`${tag.name} not exists`)
  },

  database: ({
    tag,
  }) => tag.attr.name,


  // TODO: finire gestione indice primario per generazione relationship
  /*constraint: ({
    tag,
    db,
  }) => {
    tag.eachChild((tagChild) => {
      console.log(tagChild.name)
      const r = resolve({
        tag: tagChild,
      });

      if (!r) {
        return;
      }

      console.log(r);
    });
  },*/

  customidxs: ({
    tag,
    db,
  }) => {
    tag.eachChild((tagChild) => {
      const r = resolve({
        tag: tagChild,
        db,
      });

      if (!r) {
        return;
      }

      //console.log(r);
    });
  },

  object: ({
    tag,
    db,
  }) => {
    console.log(tag.attr, db);
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