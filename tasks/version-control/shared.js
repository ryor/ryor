async function runShellCommand(command, args, captureOutput = false) {
  if (!spawn) spawn = (await import('child_process')).spawn

  let name

  if (args) name = command
  else {
    const [value1, ...rest] = command.split(' ')

    name = value1
    args = rest
  }

  return new Promise((resolve) => {
    const childProcess = spawn(name, args, { stdio: captureOutput ? ['ignore', 'pipe', 'pipe'] : ['ignore', 1, 2] })

    if (captureOutput) {
      let stderr = ''
      let stdout = ''

      childProcess.stderr.on('data', (data) => (stderr += data.toString()))
      childProcess.stdout.on('data', (data) => (stdout += data.toString()))
      childProcess.on('close', (code) => resolve({ code, stderr: stderr.trim(), stdout: stdout.trim() }))
    } else childProcess.on('close', (code) => resolve({ code }))
  })
}

export async function checkoutBranch(branch) {
  await runShellCommand(`git checkout ${branch}`)
}

export async function commit(message, push = false, allowEmpty = false) {
  await runShellCommand('git add --all')

  const args = ['commit', '-m', message]

  if (allowEmpty) args.push('--allow-empty')

  await runShellCommand('git', args)

  if (push) await runShellCommand('git push')
}

export async function createBranch(branch) {
  await runShellCommand(`git checkout -b ${branch}`)
  await runShellCommand(`git push --set-upstream origin ${branch}`)
}

export async function createVersionTag(version) {
  await runShellCommand('git', ['tag', '-a', `v${version}`, '-m', `Release v${version}`])
  await runShellCommand(`git push origin v${version}`)
}

export async function fetchTags() {
  await runShellCommand('git fetch --tags')
}

export async function getAllBranches() {
  return (await runShellCommand('git branch --all', undefined, true)).stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line)
    .reduce(
      (result, line) => {
        if (line.startsWith('*')) {
          const branchName = line.split('*')[1].trim()

          return {
            ...result,
            current: branchName,
            local: [...result.local, branchName]
          }
        } else if (line.startsWith('remotes/origin/')) {
          if (!line.includes('HEAD')) {
            return {
              ...result,
              remote: [...result.remote, line.split('remotes/origin/')[1]]
            }
          }

          return result
        } else return { ...result, local: [...result.local, line] }
      },
      { current: null, local: [], remote: [] }
    )
}

export async function getAllTags() {
  return (await runShellCommand('git tag --sort=-v:refname', undefined, true)).stdout.split('\n').map((line) => line.trim())
}

export async function getCurrentBranch() {
  return (await runShellCommand('git branch --show-current', undefined, true)).stdout
}

export async function isCommitRequired() {
  return (await runShellCommand('git status -s', undefined, true)).stdout !== ''
}

export async function isExistingBranch(name) {
  return (await runShellCommand(`git rev-parse --verify ${name}`)).code === 0
}

export async function isPullRequired() {
  return (await runShellCommand('git pull --dry-run', undefined, true)).stdout !== ''
}

export async function isPushRequired() {
  return (await runShellCommand('git status', undefined, true)).stdout.includes('Your branch is ahead of')
}

export async function isValidBranchName(name) {
  return (await runShellCommand(`git check-ref-format --branch ${name}`)).code === 0
}

export async function mergeBranch(name, message) {
  const args = ['merge', '--no-edit', '-X', 'theirs']

  if (message) args.push('-m', message)

  args.push(name)

  await runShellCommand('git', args)
  await runShellCommand('git push')
}

export async function pull() {
  await runShellCommand('git pull')
}

let spawn
