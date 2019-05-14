const path = require('path');
const findPackage = require('./lib/find-package');
const writeCsv = require('./lib/write-csv');
const writeJson = require('./lib/write-json');

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
  const deps = [];

  await collectDeps(
    deps,
    await findPackage(DIR),
    args.includes('-p') || args.includes('--production')
  );

  deps.sort((a, b) => a.name.localeCompare(b.name));

  if (args.includes('-j') || args.includes('--json')) {
    await writeCsv(
      path.join(DIR, args.filter(i => i.indexOf('-') !== 0)[0] || 'licenses.json'),
      deps
    );
  } else {
    await writeJson(
      path.join(DIR, args.filter(i => i.indexOf('-') !== 0)[0] || 'licenses.csv'),
      deps
    );
  }
})();
