import spawn from 'cross-spawn'

export const getCurrentBranchName = () => new Promise(resolve => spawn('git', ['branch', '--show-current']).stdout.on('data', data => resolve(data.toString().trim())))

export const isCodeCommitted = () => new Promise(resolve => spawn('git', ['status', '-s']).stdout.on('data', data => resolve(data.toString().trim() === '')))

export const isExistingBranch = name => new Promise(resolve => spawn('git', ['rev-parse', '--verify', name]).on('close', code => resolve(code === 0)))

export const isValidBranchName = name => new Promise(resolve => spawn('git', ['check-ref-format', '--branch', name]).on('close', code => resolve(code === 0)))
