const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const findLicenses = require('./find-license');

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const stringifyLicenses = licenses => [...new Set(licenses)].sort().join(', ');

const findPackage = async depPath => {
  try {
    const config = JSON.parse(String(await readFile(path.join(depPath, 'package.json'))));
    const files = await readDir(depPath);

    const licenses = [];
    const licenseFiles = files.filter(i => i.toUpperCase().includes('LICENSE'));

    for (const file of licenseFiles) {
      licenses.push(
        ...findLicenses(
          String(await readFile(path.join(depPath, file)))
        )
      );
    }

    const readmes = [];
    const readmeFiles = files.filter(i => i.toUpperCase().indexOf('README') === 0);
    for (const file of readmeFiles) {
      readmes.push(
        ...findLicenses(
          String(await readFile(path.join(depPath, file)))
        )
      );
    }

    return {
      author: config.author ? config.author.name || config.author : '',
      licenses: {
        package: stringifyLicenses(findLicenses(config.license)),
        license: stringifyLicenses(licenses),
        readme: stringifyLicenses(readmes)
      },
      name: config.name,
      repository: config.repository ? config.repository.url : '',
      version: config.version,

      path: depPath,
      dependencies: Object.keys(config.dependencies),
      devDependencies: Object.keys(config.devDependencies)
    };
  } catch (e) {
    return null;
  }
};

module.exports = findPackage;
