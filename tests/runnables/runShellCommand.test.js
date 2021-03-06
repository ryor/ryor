/* eslint-env jest */

import { bold } from 'chalk'
import { resolve } from 'path'
import { runShellCommand } from '../../source/runnables/runShellCommand'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'

describe('Run shell command', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  let args, output

  beforeAll(() => {
    process.chdir(resolve(projectsDirectoryPath, 'all'))
    ensureCorrectPATHValue()
    jest.spyOn(process.stderr, 'write').mockImplementation(data => { output += data })
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('throws error when executable cannot be resolved', async () => {
    try {
      await runShellCommand('unresolvable')
    } catch (error) {
      expect(error.message).toBe(`Could not resolve ${bold('unresolvable')}`)
    }
  })

  test('throws error when child process does not exit cleanly', async () => {
    try {
      await runShellCommand('fail')
    } catch (error) {
      expect(error.message).toBe('')
    }

    try {
      await runShellCommand('node-error')
    } catch (error) {
      expect(error.message).toBe('')
      expect(output.includes('ERR_INVALID_ARG_TYPE')).toBe(true)
    }

    jest.resetModules()
    jest.mock('cross-spawn', () => ({
      spawn: () => ({
        on: (event, callback) => {
          if (event === 'error') callback('Some error') // eslint-disable-line
          if (event === 'close') callback(1) // eslint-disable-line
        },
        stderr: { on: () => {} },
        stdout: { on: () => {} }
      })
    }))

    try {
      await require('../../source/runnables/runShellCommand').runShellCommand('command')
    } catch (error) {
      expect(error.message).toBe('Some error')
    }

    jest.unmock('cross-spawn')
    jest.resetModules()
  })

  test('outputs any possible error output emitted from child process even when subprocess exits cleanly', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(data => { output += data })

    jest.resetModules()
    jest.mock('cross-spawn', () => ({
      spawn: () => ({
        on: (event, callback) => {
          if (event === 'error') callback('Some error') // eslint-disable-line
          if (event === 'close') callback(0) // eslint-disable-line
        },
        stderr: { on: () => {} },
        stdout: { on: () => {} }
      })
    }))

    await require('../../source/runnables/runShellCommand').runShellCommand('command')
    expect(output).toBe('Some error')

    consoleErrorMock.mockRestore()
    jest.unmock('cross-spawn')
    jest.resetModules()
  })

  test('cd', async () => {
    await runShellCommand('cd')
    expect(process.cwd()).toBe(resolve(projectsDirectoryPath, 'all'))
    await runShellCommand('cd', ['..'])
    expect(process.cwd()).toBe(projectsDirectoryPath)
    await runShellCommand('cd', ['all'])
    expect(process.cwd()).toBe(resolve(projectsDirectoryPath, 'all'))
  })

  test('echo', async () => {
    args = ['Did', 'something.']
    await runShellCommand('echo', args)
    expect(output.trim()).toBe(args.join(' '))
  })

  test('executable in node_modules/.bin directory', async () => {
    args = ['Did', 'something.']
    await runShellCommand('log', args)
    expect(output.trim()).toBe(args.join(' '))

    output = ''
    await runShellCommand('wait-log', args)
    expect(output.trim()).toBe(args.join(' '))

    output = ''
    await runShellCommand('output-error')
    expect(output.trim()).toBe('Error')
  })
})
