const description = 'Checks TypeScript for errors with TSLint and then tests TypeScript with Jest'

const run = [
  'log -w Checking TypeScript for errors with TSLint',
  'tslint',
  'log -w Testing TypeScript with Jest',
  'echo',
  'jest',
  'echo',
  'log -s All tests passed'
]

module.exports = {description, run}
