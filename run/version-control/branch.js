export const description = 'Displays Git branches or creates and/or switches to feature or fix branches'

export const args = {
  feature: {
    alias: 'f',
    description: 'Creates and/or switches to feature branch',
    type: 'boolean'
  },
  fix: {
    alias: 'x',
    description: 'Creates and/or switches to fix branch',
    type: 'boolean'
  }
}

export async function run({ feature, fix, _ }) {
  if (feature && fix) return 'log -e "Both --feature and --fix cannot be used at the same time"'

  if (feature || fix) {
    if (_.length === 0) return `log -e Valid ${feature ? 'feature' : 'fix'} name required`

    const { getAllBranches, isValidBranchName } = await import('./shared.js')
    const { local, remote } = await getAllBranches()
    const featureOrFixName = _[0]
    const requestedBranch = `${feature ? 'feature' : 'fix'}/${featureOrFixName}`

    if (local.includes(requestedBranch)) return [`git checkout ${requestedBranch}`, 'git branch --all']
    else if (remote.includes(requestedBranch)) return [`git checkout ${requestedBranch}`, 'git pull', 'git branch --all']
    else if (!(await isValidBranchName(requestedBranch))) return `log -e Invalid ${feature ? 'feature' : 'fix'} name: ${featureOrFixName}`
    else return [`git checkout -b ${requestedBranch}`, `git push --set-upstream origin ${requestedBranch}`, 'git branch --all']
  }

  if (_.length > 0) {
    const { getAllBranches } = await import('./shared.js')
    const { local } = await getAllBranches()
    const requestedBranch = _[0]

    if (local.includes(requestedBranch)) return `git checkout ${requestedBranch}`
  }

  return 'git branch --all'
}
