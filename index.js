const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const findPackage = require('./lib/find-package');

const writeFile = promisify(fs.writeFile);
const DIR = process.cwd();

const collectDeps = async (deps, dep, prodOnly) => {
  const depsToCheck = prodOnly ? dep.dependencies : [...dep.dependencies, ...dep.devDependencies];

  for (const i of depsToCheck) {
    let pack = await findPackage(path.join(dep.path, 'node_modules', i));

    if (!pack) {
      pack = await findPackage(path.join(DIR, 'node_modules', i));
    }

    if (pack && !deps.find(j => j.name === pack.name && j.version === pack.version)) {
      deps.push(pack);
      await collectDeps(deps, pack, prodOnly);
    }
  }
};

(async () => {
  const args = process.argv.slice(2);
  const PROD = ['-p', '--production'].includes(args[0]);
  const OUT = args.length > 1 ? args[1] : args.length > 0 && !PROD ? args[0] : 'license.csv';
  const deps = [];

  await collectDeps(deps, await findPackage(DIR), PROD);

  deps.sort((a, b) => a.name.localeCompare(b.name));

  const result = [
    'Name;Version;Author;From package.json;From LICENSE;From README;Repository',
    ...deps.map(i => `${i.name};${i.version};${i.author};${i.licenses.package};${i.licenses.license};${i.licenses.readme};${i.repository}`)
  ];

  await writeFile(path.join(DIR, OUT), result.join('\n'));
})();
