const fs = require('fs');
const { promisify } = require('util');

module.exports = (name, deps) => promisify(fs.writeFile)(
  name,
  [
    'Name;Version;Author;From package.json;From LICENSE;From README;Repository',
    ...deps.map(i => `${i.name};${i.version};${i.author};${i.licenses.package};${i.licenses.license};${i.licenses.readme};${i.repository}`)
  ]
    .join('\n')
);
