const description = 'Runs commit task and then pushes changes to Github'

function run(args)
{
  if (args.length === 0)
  {
    const {bold} = require('chalk')

    throw new Error(`A commmit message is required to run the ${bold('push')} task`)
  }

  return [
    `commit '${args.join(' ')}'`,
    'log -w Pushing changes to Git repository',
    'git push --quiet',
    'log -s Commit pushed'
  ]
}

module.exports = {description, run}
