const description = 'Runs commit task, updates semver patch numbers in package.json and README files, tags changes and pushes commit and tag to Github'

function run(args)
{
  if (args.length === 0)
  {
    const {bold} = require('chalk')

    throw new Error(`A commmit message is required to run the ${bold('release')} task`)
  }

  const currentVersion = require('../../package.json').version.split('.')
  const newVersion = `${currentVersion[0]}.${currentVersion[1]}.${Number(currentVersion[2]) + 1}`

  return [
    `commit '${args.join(' ')}'`,
    'log -w Updating semver patch numbers in package.json and README files',
    'patch',
    `git commit -a --amend --no-edit`,
    'log -w Adding new tag to Git repository',
    `git tag -a v${newVersion} -m "Version ${newVersion}"`,
    'log -w Pushing commit and tag to Github',
    'git push --follow-tags'
  ]
}

module.exports = {description, run}
