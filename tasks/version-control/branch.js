import { getCurrentBranch } from './shared.js'

export const description = 'Displays Git branches or creates and/or switches to bugfix, chore, feature or hotfix branches'

export const args = {
  bugfix: {
    alias: 'b',
    description: 'Creates and/or switches to bugfix branch',
    type: 'boolean'
  },
  chore: {
    alias: 'c',
    description: 'Creates and/or switches to chore branch',
    type: 'boolean'
  },
  feature: {
    alias: 'f',
    description: 'Creates and/or switches to feature branch',
    type: 'boolean'
  },
  hotfix: {
    alias: 'x',
    description: 'Creates and/or switches to hotfix branch',
    type: 'boolean'
  }
}

export async function run({ _, ...args }) {
  const branchPart = _[0]
  const types = ['bugfix', 'chore', 'feature', 'hotfix'].filter((type) => args[type])

  if (types.length === 0) {
    const sequence = ['git branch --all']

    if (branchPart) {
      const { getAllBranches } = await import('./shared.js')
      const { local } = await getAllBranches()
      const branch = local.find((name) => name.startsWith(branchPart))

      if (branch) sequence.unshift(`git checkout ${branch}`)
    }

    return sequence
  }

  if (types.length > 1) return 'log -e Only one branch type may be specified at a time'

  const { getAllBranches, isValidBranchName } = await import('./shared.js')
  const { local, remote } = await getAllBranches()
  const type = types[0]
  const branch = `${type}/${branchPart}`

  if (local.includes(branch)) return [`git checkout ${branch}`, 'git branch --all']
  else if (remote.includes(branch)) return [`git checkout ${branch}`, 'git pull', 'git branch --all']
  else if (!(await isValidBranchName(branch))) return `log -e Invalid ${type} name: ${branchPart}`
  else {
    const currentBranch = await getCurrentBranch()
    const onRequiredSourceBranch = type === 'hotfix' ? currentBranch.startsWith('release') : currentBranch === 'develop'

    if (!onRequiredSourceBranch) return `log -e A ${type} branch can only be created from ${type === 'hotfix' ? 'a release' : 'the develop'} branch`

    return [`git checkout -b ${branch}`, `git push --set-upstream origin ${branch}`, 'git branch --all']
  }
}
