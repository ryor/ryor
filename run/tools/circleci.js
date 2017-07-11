'use strict'

function description()
{
  const {bold} = require('chalk')

  return `Runs ${bold('test')} and ${bold('build')} tasks in parallel to speed up Travis builds and uploads code coverage results to Codecov`
}

const run = [
  'log -w Testing and building',
  ['test -cps', 'build -s'],
  'log -s All tests passed and build completed successfully',
  'log -w Uploading code coverage results to Codecov',
  'codecov'
]

if (process.env.CIRCLE_BRANCH !== 'master')
  run.push('npm publish')

module.exports = {description, run}
