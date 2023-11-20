async function runShellCommand(command) {
  const { spawn } = await import('child_process')

  return new Promise((resolve) => {
    const [name, ...args] = command.split(' ')
    const childProcess = spawn(name, args)
    let stderr = ''
    let stdout = ''

    childProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    childProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    childProcess.on('close', (code) => resolve({ code, stderr: stderr.trim(), stdout: stdout.trim() }))
  })
}

export async function checkoutBranch(branch) {
  await runShellCommand(`git checkout ${branch}`)
}

export async function commit(message, push = false) {
  await runShellCommand('git add --all')
  await runShellCommand(`git commit -m ${message}`)
  if (push) await runShellCommand('git push')
}

export async function createBranch(branch) {
  await runShellCommand(`git checkout -b ${branch}`)
  await runShellCommand(`git push --set-upstream origin ${branch}`)
}

export async function createTag(name, message) {
  await runShellCommand(`git tag -a ${name} -m "${message}"`)
  await runShellCommand(`git push ${name}`)
}

export async function doesTagExist(name) {
  return (await runShellCommand(`git tag -v ${name}`)).stderr !== `error: tag '${name}' not found.`
}

export async function getAllBranches() {
  const { stdout } = await runShellCommand('git branch --all')

  return stdout
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

export async function fetchAll() {
  await runShellCommand('git fetch --all --tags')
}

export async function getCurrentBranch() {
  return (await runShellCommand('git branch --show-current')).stdout
}

export async function isCommitRequired() {
  return (await runShellCommand('git status -s')).stdout !== ''
}

export async function isExistingBranch(name) {
  return (await runShellCommand(`git rev-parse --verify ${name}`)).code === 0
}

export async function isPushRequired() {
  return (await runShellCommand('git status')).stdout.includes('Your branch is ahead of')
}

export async function isValidBranchName(name) {
  return (await runShellCommand(`git check-ref-format --branch ${name}`)).code === 0
}
