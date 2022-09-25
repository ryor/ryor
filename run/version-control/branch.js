export const description = 'Displays, creates or switches to Git branch'

export async function run({ _ }) {
  if (_.length > 0) {
    const { getAllBranches, isValidBranchName } = await import('./shared.js')
    const { local, remote } = await getAllBranches()
    const requestedBranch = _[0]

    if (local.includes(requestedBranch)) return `git checkout ${requestedBranch}`

    if (remote.includes(requestedBranch)) {
      return [`git checkout ${requestedBranch}`, 'git pull']
    }

    if (requestedBranch.startsWith('feature/') || requestedBranch.startsWith('fix/')) {
      const isFeature = requestedBranch.startsWith('feature/')
      const featureOrFixName = isFeature ? requestedBranch.split('feature/')[1] : requestedBranch.split('fix/')[1]

      if (featureOrFixName.length === 0) return `log -e Valid ${isFeature ? 'feature' : 'fix'} name required`

      if (!(await isValidBranchName(requestedBranch))) return `log -e Invalid branch name: ${requestedBranch}`

      return [`git checkout -b ${requestedBranch}`, `git push --set-upstream origin ${requestedBranch}`]
    } else return 'log -e New branch names should start with either feature/ or fix/'
  }

  return 'git branch --all'
}
