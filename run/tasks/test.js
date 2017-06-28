const description = 'Checks TypeScript for errors with TSLint and then tests TypeScript with Jest'

const run = [
  'tslint',
  'jest -cv'
]

module.exports = {description, run}
