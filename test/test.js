const MainaJoi = require('../');

const m = new MainaJoi({
  file: './test.dbm',
});

const text = m.get('post')
  .get('text');

const fields = m.get('post')
  .get();

const userId = m.get('post')
  .rel('user')
  .get('id');

console.log(text, fields, userId);