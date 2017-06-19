const description = 'Checks TypeScript for errors with TSLint'

const run = [
  'log -w Checking TypeScript for errors with TSLint',
  'tslint',
  'log -s No errors found.'
]

module.exports = {description, run}
