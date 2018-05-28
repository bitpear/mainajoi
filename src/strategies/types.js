function resolve(t){
  return (
    typeStrategies[t.name] || 
      (() => console.log(`type ${t.name} not exists`))
  )(t);
}

function checkParams(jj, length, notNull, defaultValue){
  if(length > 0){
    jj = jj.max(length);
  }

  if(!notNull){
    jj = jj.allow(null);
  }

  if(defaultValue){
    jj = jj.default(defaultValue);
  }
}

const baseTypes = {
  integer: ({name, ...args}) => ({
    joiString: `.number()
      .integer()
      ${args.length > 0 ? `.max(${args.length})` : `` }
      ${!notNull ? `.allow(null)` : `` }
      ${defaultValue ? `.default(${args.defaultValue})` : `` }`,
      // TODO: funzione per aggiungere i parametri aggiuntivi per generazione stringa
    get: (j) => checkParams(j.number().integer(), args),
  }),
  text: ({name, length, notNull, defaultValue}) => ({
    joiString: `.string()${length > 0 ? `.max(${length})` : `` }`,
    get: (j) => checkParams(j.string(), length, notNull, defaultValue),
  }),
  bool: ({name, notNull, defaultValue}) => ({
    joiString: `.boolean()`,
    get: j => j.boolean(),
  }),
  date: ({name, notNull, defaultValue}) => ({
    joiString: `.date()`,
    get: j => j.date(),
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