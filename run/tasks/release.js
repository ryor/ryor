const {bold} = require('chalk')
const {log, shell: {rm, series}} = require('../utils/scripts')

const description = 'Verifies that tests pass and build completes succesfully, increments package.json patch numbers, commits changes to Git repository and pushes commit to Github'

function run(args)
{
  if (args.length === 0)
    throw new Error(`A commmit message is required to run the ${bold('release')} task`)

  return series(
    log.task('Checking TypeScript for errors with TSLint'),
    'tslint',
    log.task('Testing TypeScript with Jest'),
    'echo',
    'jest',
    'echo',
    rm('coverage'),
    log.task('Confirming build completes succesfully'),
    'tsc',
    'rollup',
    rm('build'),
    log.task('Updating semver patch number in package.json file'),
    'patch',
    log.task('Committing changes to Git repository'),
    `git commit '${args.join(' ')}'`,
    log.task('Adding new tag to Git repository'),
    'git tag',
    log.task('Pushing commit and tag to Github'),
    'git push'
  )
}

module.exports = {description, run}
