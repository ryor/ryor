const description = 'Runs Git commands'

function run(args)
{
  const {bold} = require('chalk')

  if (args.length === 0)
    throw new Error(`A Git command is required to use the ${bold('git')} tool`)

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
