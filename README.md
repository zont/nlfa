# nlfa

[!['Build status'][travis_image_url]][travis_page_url]

[travis_image_url]: https://api.travis-ci.org/zont/nlfa.svg
[travis_page_url]: https://travis-ci.org/zont/nlfa

nlfa is a utility for attempting to identify the licenses and author of modules in a nodejs project.

It looks for license information in package.json, readme and license files in the project.
Please note, in many cases the utility is looking for standard strings in these files, such as MIT, BSD, Apache,
GPL etc - this is not error free, so if you have any concerns at all about the accuracy of the results, you will
need to perform a detailed manual review of the project and its dependencies, reading all terms of any included
or referenced license.

## Install

```sh
npm i -D nlfa
```

## Use

```sh
nlfa [options] <target>

options:
  - `-p`, `--production` (Default: false) - exclude devDependencies
  - `-j`, `--json` (Default: false) - output in JSON

<target> is `licenses.csv` or `licenses.json` by default
```

Example:
```sh
nlfa -p licenses-with-authors.csv
```
