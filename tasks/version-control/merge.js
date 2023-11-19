export const description = 'Merges bugfix, chore, feature and hotfix branches into develop and/or release branches'

export const args = {
  delete: {
    alias: 'd',
    description: 'Delete current branch after merge'
  }
}

export async function run({ delete: deleteBranch }) {
  const { getAllBranches, getCurrentBranch, isCommitRequired, isPushRequired } = await import('./shared.js')
  const currentBranch = await getCurrentBranch()

  if (['bugfix', 'chore', 'feature', 'hotfix'].find((type) => currentBranch.startsWith(`${type}/`))) {
    const targetBranch = currentBranch.startsWith('hotfix') ? (await getAllBranches()).local.find((name) => name.startsWith('release')) : 'develop'

    if (targetBranch) {
      const sequence = []

      if (await isCommitRequired()) sequence.push('commit -p')
      else if (await isPushRequired()) sequence.push('git push')

      // prettier-ignore
      sequence.push(
        `git checkout ${targetBranch}`,
        'git pull',
        `git merge --no-edit -X theirs ${currentBranch}`,
        'git push'
      )

      if (currentBranch.startsWith('hotfix')) {
        // prettier-ignore
        sequence.push(
          'git checkout develop',
          'git pull',
          `git merge --no-edit -X theirs ${currentBranch}`,
          'git push'
        )
      }

      if (deleteBranch) sequence.push(`git branch -D ${currentBranch}`, `git push origin --delete ${currentBranch}`)
      else sequence.push(`git checkout ${currentBranch}`)

      return sequence
    }
  } else return 'log -e Use merge on bugfix, chore, feature or hotfix branches'
}
