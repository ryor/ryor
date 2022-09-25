export async function getAllBranches() {
  const { spawn } = await import('child_process')

  return new Promise((resolve) =>
    spawn('git', ['branch', '--all']).stdout.on('data', (data) => {
      resolve(
        data
          .toString()
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
      )
    })
  )
}

export async function getCurrentBranch() {
  const { spawn } = await import('child_process')

  return new Promise((resolve) => spawn('git', ['branch', '--show-current']).stdout.on('data', (data) => resolve(data.toString().trim())))
}

export async function isCommitRequired() {
  const { spawn } = await import('child_process')

  return new Promise((resolve) => {
    const childProcess = spawn('git', ['status', '-s'])
    let output = ''

    childProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    childProcess.on('close', () => resolve(output.trim() !== ''))
  })
}

export async function isExistingBranch(name) {
  const { spawn } = await import('child_process')

  return new Promise((resolve) => spawn('git', ['rev-parse', '--verify', `"${name}"`]).on('close', (code) => resolve(code === 0)))
}

export async function isValidBranchName(name) {
  const { spawn } = await import('child_process')

  return new Promise((resolve) => spawn('git', ['check-ref-format', '--branch', `"${name}"`]).on('close', (code) => resolve(code === 0)))
}
