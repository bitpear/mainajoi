function resolve(t){
  return (
    typeStrategies[t.name] || 
      (() => console.log(`type ${t.name} not exists`))
  )(t);
}

const baseTypes = {
  integer: ({name, length}) => ({
    joiString: `.number().integer()${length > 0 ? `.max(${length})` : `` }`,
    get: (j) => {
      let jj = j.number().integer();

      if(length > 0){
        jj = jj.max(length);
      }

      return jj;
    },
  }),
  text: ({name, length}) => ({
    joiString: `.string()${length > 0 ? `.max(${length})` : `` }`,
    get: (j) => {
      let jj = j.string();

      if(length > 0){
        jj = jj.max(length);
      }

      return jj;
    },
  }),
  bool: ({name}) => ({
    joiString: `.boolean()`,
    get: j => j.boolean(),
  }),
  date: ({name}) => ({
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