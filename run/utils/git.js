import spawn from 'cross-spawn'

export const getCurrentBranchName = () => new Promise(resolve => spawn('git', ['branch', '--show-current']).stdout.on('data', data => resolve(data.toString().trim())))

export const isCommitRequired = () => new Promise(resolve => {
  const childProcess = spawn('git', ['status', '-s'])
  let output = ''

  childProcess.stdout.on('data', data => { output += data.toString() })

  childProcess.on('close', () => resolve(output.trim() !== ''))
})

export const isExistingBranch = name => new Promise(resolve => spawn('git', ['rev-parse', '--verify', name]).on('close', code => resolve(code === 0)))

export const isValidBranchName = name => new Promise(resolve => spawn('git', ['check-ref-format', '--branch', name]).on('close', code => resolve(code === 0)))
