function resolve(t){
  return (
    typeStrategies[t.name] || 
      (() => console.log(`type ${t.name} not exists`))
  )(t);
}

function checkParams(jj, {length, notNull, defaultValue}){
  const isJ = typeof jj !== 'string';

  if(length > 0){
    jj = isJ ? jj.max(length) : `${jj}.max(${length})`;
  }

  if(!notNull){
    jj = isJ ? jj.allow(null) : `${jj}.allow(null)`;
  }

  if(typeof defaultValue !== 'undefined'){
    jj = isJ ? jj.default(defaultValue) : `${jj}.default(${defaultValue})`;
  }

  return jj;
}

function cleanValue(type, value){
  switch(type){
    case 'integer':
      const v = parseInt(value);
      if(isNaN(v)){
        return undefined;
      }
      return v;
    break;

    case 'text':
      return `'${value}'`;

    case 'bool':
      return value === 'true';

    default:
      return value;
  }
}

function params(type, {defaultValue, ...args}){
  return {
    ...args,
    defaultValue: defaultValue ? cleanValue(type, defaultValue) : undefined,
  };
}

const baseTypes = {
  integer: ({name, ...args}) => ({
    joiString: checkParams(`.number().integer()`, params('integer', args)),
    get: (j) => checkParams(j.number().integer(), params('integer', args)),
  }),
  text: ({name, ...args}) => ({
    joiString: checkParams(`.string()`, params('text', args)),
    get: (j) => checkParams(j.string(), params('text', args)),
  }),
  bool: ({name, ...args}) => ({
    joiString: checkParams(`.boolean()`, params('bool', args)),
    get: j => checkParams(j.boolean(), params('bool', args)),
  }),
  date: ({name, ...args}) => ({
      joiString: checkParams(`.date()`, params('text', args)),
      get: j => checkParams(j.date(), params('text', args)),
  }),
};

const types = {
  ...baseTypes,
  bigserial: baseTypes.integer,
  timestamp: baseTypes.integer,
  bigint: baseTypes.integer,
  int4: baseTypes.integer,
  //integer: baseTypes.integer,
  varchar: baseTypes.text,
  //text: baseTypes.string,
  //bool: baseTypes.bool,
  //date: baseTypes.date,
};

module.exports = types;