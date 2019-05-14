const fs = require('fs');
const { promisify } = require('util');

module.exports = (name, deps) => promisify(fs.writeFile)(
  name,
  JSON.stringify(
    deps.map(i => ({
      author: i.author,
      licenses: i.licenses,
      name: i.name,
      repository: i.repository,
      version: i.version
    })),
    null,
    '  '
  )
);
