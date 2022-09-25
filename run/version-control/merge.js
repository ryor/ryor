export const description = 'Merges feature, fix or release branches'

export const args = {
  delete: {
    alias: 'd',
    description: 'Delete current branch after merge'
  }
}

export async function run({ delete: deleteBranch }) {
  const { getCurrentBranch, isCommitRequired } = await import('./shared.js')
  const currentBranch = await getCurrentBranch()

  if (currentBranch.startsWith('feature/') || currentBranch.startsWith('fix/') || currentBranch.startsWith('release/')) {
    console.log(await isCommitRequired())
    // sequence.push(await isCommitRequired() ? 'commit -p' : 'git push')
    /*
    const targetBranch = currentBranch.startsWith('feature/') ? 'development' : currentBranch.startsWith('fix/') ? 'release' : 'main'
    const sequence = []

    sequence.push(
      'git push',
      `git checkout ${targetBranch}`,
      'git pull',
      `git merge --no-ff -X theirs ${currentBranch}`,
      'git push'
    )

    if (currentBranch === 'release') {
      sequence.push(async () => {
        const { readFile } = await import('fs/promises')
        const { version } = JSON.parse(await readFile('package.json'))

        return [`git tag -a v${version} -m "Version ${version}"`, `git push origin v${version}`]
      })
    }

    if (currentBranch === 'release' || deleteBranch) {
      sequence.push(
        `git branch -D ${currentBranch}`,
        `git push origin --delete ${currentBranch}`
      )
    } else sequence.push(`git checkout ${currentBranch}`)
    */

    return sequence
  } else return 'log -e Use merge for fix, feature or release branches'
}
