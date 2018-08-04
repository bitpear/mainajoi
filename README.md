# mainajoi

 Transform pgModeler dbm (dbmodel) file into Joi objects 


## Example

Parsing dbm file
```javascript
const m = new MainaJoi({
  file: './test.dbm',
});
```
Get single field
```javascript
const text = m.get('post')
  .get('text');
```

Get all fields
```javascript
const fields = m.get('post')
  .get();
```

Get relation table
```javascript
const rel = m.get('post')
  .rel('user');
```