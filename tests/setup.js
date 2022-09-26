import { spawn } from 'cross-spawn'

jest.mock('cross-spawn', () => ({
  spawn: (command, args, options) => {
    const childProcess = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] })

    childProcess.stderr.on('data', (data) => {
      process.stderr.write(data.toString())
    })
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data.toString())
    })

    return childProcess
  }
}))

jest.mock('../source/modules/importModule', () => ({
  importModule: async (path, debug = false) => {
    try {
      return require(path)
    } catch (error) {
      if (debug) throw error
    }

    return undefined
  }
}))
