const description = 'Commits changes to Git repository, tags commit and pushes tag to Github'

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
    /*
    'build',
    'shx rm -rf build coverage',
    'log -w Updating semver patch numbers in package.json and README files',
    'patch',
    'log -w Committing changes to Git repository',
    'git add -A',
    `git commit -m '${args.join(' ')}'`,
    'log -w Adding new tag to Git repository',
    `git tag -a v${newVersion} -m "Version ${newVersion}"`,
    'log -w Pushing commit and tag to Github',
    'git push --follow-tags'
    */
  ]
}

module.exports = {description, run}
