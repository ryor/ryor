export const description = 'Merges chore, feature, fix or release branches'

export const args = {
  delete: {
    alias: 'd',
    description: 'Delete current branch after merge'
  }
}

export async function run({ delete: deleteBranch }) {
  const { getAllBranches, getCurrentBranch, isCommitRequired, isPushRequired } = await import('./shared.js')
  const currentBranch = await getCurrentBranch()

  if (['bugfix', 'chore', 'feature', 'hotfix', 'release'].findIndex((type) => currentBranch.startsWith(`${type}/`)) > -1) {
    let targetBranch = currentBranch.startsWith('release/') ? 'main' : currentBranch.startsWith('hotfix/') ? 'release' : 'develop'

    if (targetBranch === 'release') targetBranch = (await getAllBranches()).local.find((name) => name.startsWith('release'))

    if (targetBranch) {
      const isRelease = targetBranch === 'main'
      const sequence = []
      let version

      if (await isCommitRequired()) sequence.push('commit -p')
      else if (await isPushRequired()) sequence.push('git push')

      if (isRelease) version = JSON.parse(await (await import('fs/promises')).readFile('package.json')).version

      sequence.push(
        `git checkout ${targetBranch}`,
        'git pull',
        `git merge --no-edit ${isRelease ? `-m "Release v${version}"` : '--no-ff'} -X theirs ${currentBranch}`,
        'git push'
      )

      if (isRelease) sequence.push(`git tag -a v${version} -m "Version ${version}"`, `git push origin v${version}`)

      if (isRelease || deleteBranch) {
        sequence.push(`git branch -D ${currentBranch}`, `git push origin --delete ${currentBranch}`)
      } else sequence.push(`git checkout ${currentBranch}`)

      return sequence
    }
  } else return 'log -e Use merge for bugfix, chore, feature, hotfix or release branches'
}
