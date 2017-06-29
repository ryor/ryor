'use strict'

const description = 'Checks TypeScript for errors with TSLint and then tests TypeScript with Jest'

const run = [
  'tslint',
  'jest -c'
]

module.exports = {description, run}
