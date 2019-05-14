/**
 *
 * @description Module for identifying license from a text string
 * @author Ian Kelly
 *
 * @copyright Copyright (C) Ian Kelly
 *
 * @license The MIT License
 *
 */

const preRegex = '(?:^|\\s|"|\\()';
const postRegex = '(?:$|\\s|"|\\))';

const regexpBuilder = (text, flags) => new RegExp(preRegex + text + postRegex, flags);
const patterns = [
  {
    'name': 'BSD',
    'regex': [
      regexpBuilder('BSD'),
    ]
  },
  {
    'name': 'GPL',
    'regex': [
      regexpBuilder('GPL', 'i'),
      regexpBuilder('GPLv\\d')
    ]
  },
  {
    'name': 'Public Domain',
    'regex': [
      regexpBuilder('Public domain', 'i'),
    ]
  },
  {
    'name': 'LGPL',
    'regex': [
      regexpBuilder('LGPL'),
    ]
  },
  {
    'name': 'MIT',
    'regex': [
      /(?:^|\s)MIT(?:$|\s)/,
      /(?:^|\s)\(MIT\)(?:$|\s)/
    ]
  },
  {
    'name': 'Apache',
    'regex': [
      regexpBuilder('Apache\\sLicen[cs]e', 'i')
    ]
  },
  {
    'name': 'MPL',
    'regex': [
      regexpBuilder('MPL')
    ]
  },
  {
    'name': 'WTFPL',
    'regex': [
      regexpBuilder('WTFPL'),
      regexpBuilder(
        'DO\\sWHAT\\sTHE\\sFUCK\\sYOU\\sWANT\\sTO\\sPUBLIC\\sLICEN[CS]E',
        'i'
      )
    ]
  },
  {
    'name': 'ISC',
    'regex': [
      regexpBuilder('ISC')
    ]
  },
  {
    'name': 'Eclipse Public License',
    'regex': [
      regexpBuilder('Eclipse\\sPublic\\sLicen[cs]e', 'i'),
      regexpBuilder('EPL'),
      regexpBuilder('EPL-1\\.0')
    ]
  }
];

const identifyLicense = (text = '') => {
  const output = [];

  for (let i = patterns.length - 1; i >= 0; i--) {
    const pattern = patterns[i];
    for (let j = pattern.regex.length - 1; j >= 0; j--) {
      if (pattern.regex[j].test(text)) {
        output.push(pattern.name);
        break;
      }
    }
  }

  return output;
};

module.exports = identifyLicense;
