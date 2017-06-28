const description = 'Runs Git commands'

const VALID_COMMANDS = ['commit', 'push', 'tag']

function run(args)
{
  const {bold} = require('chalk')

  if (args.length === 0)
    throw new Error(`A command is required to use the ${bold('git')} tool. Accepts ${bold('commit')}, ${bold('push')} and ${bold('tag')}.`)

  const command = args[0]

  if (!VALID_COMMANDS.includes(command))
    throw new Error(`Invalid command ${bold(command)} passed to ${bold('git')} tool. Accepts ${bold('commit')}, ${bold('push')} and ${bold('tag')}.`)

  switch (args[0])
  {
    case 'commit':

      if (args.length < 2)
        throw new Error(`A message is required for Git commit`)

      return [
        'log -w Committing changes to Git repository',
        'git add -A',
        `git commit -m '${args.slice(1).join(' ')}' --quiet`
      ]

    case 'push':

      return [
        `log -w Pushing Git repository to Github`,
        `git push --quiet --follow-tags`
      ]

    case 'tag':

      const version = require('../../package.json').version

      return [
        'log -w Adding new tag to Git repository',
        `git tag -a v${version} -m "Version ${version}"`
      ]
  }
}

module.exports = {description, run}
