const description = 'Verifies that tests pass and build completes succesfully, commits changes to Git repository. Optionally creates release tag and/or pushes commit/tag to Github'

function run(args)
{
  const minimist = require('minimist')
  const {_, push, release} = minimist(args, {
    alias: {p: 'push', r: 'release'},
    boolean: ['p', 'push', 'r', 'release']
  })

  if (_.length === 0)
  {
    const {bold} = require('chalk')

    throw new Error(`A commmit message is required to run the ${bold('commit')} task`)
  }

  const sequence = [
    'test',
    'build',
    'shx rm -rf build coverage'
  ]

  if (release)
    sequence.push(
      'log -w Updating semver patch numbers in package.json and README files',
      'patch'
    )

  sequence.push(
    'log -w Committing changes to Git repository',
    'git add -A',
    `git commit -m '${_.join(' ')}' --quiet`
  )

  if (release)
  {
    const currentVersion = require('../../package.json').version.split('.')
    const newVersion = `${currentVersion[0]}.${currentVersion[1]}.${Number(currentVersion[2]) + 1}`

    sequence.push(
      'log -w Adding new tag to Git repository',
      `git tag -a v${newVersion} -m "Version ${newVersion}"`
    )
  }

  if (push || release)
    sequence.push(
      `log -w Pushing commit${release ? ' and tag ' : ' '}to Github`,
      `git push --quiet ${release ? ' --follow-tags' : ''}`
    )

  return sequence
}

module.exports = {description, run}
