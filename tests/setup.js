/* eslint-env jest */

import { spawn } from 'child_process'

jest.mock('esm', () => () => require)

jest.mock('cross-spawn', () => ({
  spawn: (command, args, options) => {
    const childProcess = spawn(command, args, { ...options, stdio: 'pipe' })

    childProcess.stderr.on('data', data => { process.stderr.write(data) })
    childProcess.stdout.on('data', data => { process.stdout.write(data) })

    return childProcess
  }
}))
