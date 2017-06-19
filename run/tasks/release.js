const description = 'Verifies that tests pass and build completes succesfully, increments package.json patch numbers, commits changes to Git repository and pushes commit to Github'

function run(args)
{
  if (args.length === 0)
  {
    const {bold} = require('chalk')

    throw new Error(`A commmit message is required to run the ${bold('release')} task`)
  }

  return [
    'test',
    'build',
    'shx rm -rf build coverage',
    'log -w Updating semver patch number in package.json file',
    'patch',
    'log -w Committing changes to Git repository',
    `git commit '${args.join(' ')}'`,
    'log -w Adding new tag to Git repository',
    'git tag',
    'log -w Pushing commit and tag to Github',
    'git push'
  ]
}

module.exports = {description, run}
