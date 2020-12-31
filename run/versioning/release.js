import spawn from 'cross-spawn'

export const description = 'Initializes and finalizes release branches in Git repository'

export const args = {
  finalize: {
    alias: 'f',
    description: 'Finalize feature branch',
    type: 'boolean'
  },
  initialize: {
    alias: 'i',
    description: 'Initialize feature branch',
    type: 'boolean'
  }
}

export const run = async ({ _, finalize, initialize }) => {
  if (initialize) {
    if (!(await isCodeCommitted())) {
      console.error('Commit or stash changes before creating release')
      process.exit(1)
    }

    const currentVersion = require('../../package.json').version

    console.log(currentVersion)
  }
}

const isCodeCommitted = () => new Promise(resolve => spawn('git', ['status', '-s']).stdout.on('data', data => resolve(data.toString().trim() === '')))
