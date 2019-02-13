'use strict'

function description () {
  const { bold } = require('chalk')

  return `Runs ${bold('test')} and ${bold('build')} tasks in parallel to speed up CircleCI builds and uploads code coverage results to Codecov`
}

const run = [
  'log -w Testing and building',
  ['test -cps', 'build -s'],
  'log -s All tests passed and build completed successfully',
  'log -w Uploading code coverage results to Codecov',
  'codecov'
]

module.exports = { description, run }
