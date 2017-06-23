const description = 'Verifies that tests pass and build completes succesfully and commits changes to Git repository'

function run(args)
{
  if (args.length === 0)
  {
    const {bold} = require('chalk')

    throw new Error(`A commmit message is required to run the ${bold('commit')} task`)
  }

  return [
    'test',
    'build',
    'shx rm -rf build coverage',
    'log -w Committing changes to Git repository',
    'git add -A',
    `git commit -m '${args.join(' ')}' --quiet`,
    'log -w Pushing changes to Git repository',
    'git push --quiet',
    'log -s Changes committed'
  ]
}

module.exports = {description, run}
