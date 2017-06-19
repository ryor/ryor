const {bold} = require('chalk')

const description = 'Runs Git commit, tag and push commands'

function run(args)
{
  if (args.length === 0)
    throw new Error(`A specific Git command is required when using the ${bold('git')} tool`)

  const gitCommand = args[0]

  if (!['commit', 'tag', 'push'].includes(gitCommand))
    throw new Error(`The ${bold('git')} tool only accepts the following Git commands: ${bold('commit')}, ${bold('tag')} and ${bold('push')}. Received ${bold(gitCommand)}.`)

  switch (gitCommand)
  {
    case 'commit':

      if (args.length < 2)
        throw new Error(`A commmit message is required when using ${bold('git commit')}`)

      return [
        'git add --all',
        `git commit -m '${args.splice(1).join(' ')}'`
      ]

    case 'tag':

      const semver = require('../../package.json').version.split('.')
      const version = `${semver[0]}.${semver[1]}.${Number(semver[2]) + 1}`

      return `git tag -a v${version} -m "Version ${version}"`

    case 'push':
      return 'git push --follow-tags'
  }
}

module.exports = {description, run}
