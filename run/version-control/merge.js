export const description = 'Merges feature, fix or release branches'

export const args = {
  delete: {
    alias: 'd',
    description: 'Delete current branch after merge'
  }
}

export async function run({ delete: deleteBranch }) {
  const { getCurrentBranch, isCommitRequired, isPushRequired } = await import('./shared.js')
  const currentBranch = await getCurrentBranch()

  if (currentBranch.startsWith('feature/') || currentBranch.startsWith('fix/') || currentBranch.startsWith('release/')) {
    const isRelease = currentBranch.startsWith('release/')
    const targetBranch = isRelease ? 'main' : 'develop'
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
  } else return 'log -e Use merge for fix, feature or release branches'
}
