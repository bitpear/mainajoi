function checkParams(jj, {
  length,
  notNull,
  defaultValue,
}) {
  const isJ = typeof jj !== 'string';

  if (length > 0) {
    jj = isJ ? jj.max(length) : `${jj}.max(${length})`;
  }

  if (!notNull) {
    jj = isJ ? jj.allow(null) : `${jj}.allow(null)`;
  }

  if (typeof defaultValue !== 'undefined') {
    jj = isJ ? jj.default(defaultValue) : `${jj}.default(${defaultValue})`;
  }

  return jj;
}

function cleanValue(type, value) {
  switch (type) {
    case 'integer':
      const v = parseInt(value);
      if (isNaN(v)) {
        return undefined;
      }
      return v;

    case 'text':
      return `'${value}'`;

    case 'bool':
      return value === 'true';

    default:
      return value;
  }
}

function params(type, {
  defaultValue,
  ...args
}) {
  return {
    ...args,
    defaultValue: defaultValue ? cleanValue(type, defaultValue) : undefined,
  };
}

class Type {
  constructor({
    name,
    length,
    notNull,
    defaultValue,
  }) {
    this._type = null;
    this.name = name;
    this.length = length;
    this.notNull = notNull;
    this.defaultValue = defaultValue;
  }

  set(type) {
    this._type = type;
  }

  get(j) {
    return this._type.get(j);
  }

  getString() {
    return this._type.getString();
  }
}

Type.baseTypes = {
  integer: ({
    name,
    ...args
  }) => ({
    getString: () => checkParams(`.number().integer()`, params('integer', args)),
    get: j => checkParams(j.number().integer(), params('integer', args)),
  }),
  text: ({
    name,
    ...args
  }) => ({
    getString: () => checkParams(`.string()`, params('text', args)),
    get: j => checkParams(j.string(), params('text', args)),
  }),
  bool: ({
    name,
    ...args
  }) => ({
    getString: () => checkParams(`.boolean()`, params('bool', args)),
    get: j => checkParams(j.boolean(), params('bool', args)),
  }),
  date: ({
    name,
    ...args
  }) => ({
    getString: () => checkParams(`.date()`, params('text', args)),
    get: j => checkParams(j.date(), params('text', args)),
  }),
};

Type.types = {
  ...Type.baseTypes,
  bigserial: Type.baseTypes.integer,
  timestamp: Type.baseTypes.integer,
  bigint: Type.baseTypes.integer,
  int4: Type.baseTypes.integer,
  varchar: Type.baseTypes.text,
};

module.exports = Type;