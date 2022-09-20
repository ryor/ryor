/* eslint-env jest */

import chalk from 'chalk'
import { resolve } from 'path'
import { runShellCommand } from '../../source/runnables/runShellCommand'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'

describe('Run shell command', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
  let output

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
    jest.spyOn(process.stderr, 'write').mockImplementation(data => { output += data })
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    process.chdir(projectDirectoryPath)
    await ensureCorrectPATHValue()
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('throws error when executable cannot be resolved', async () => {
    try {
      await runShellCommand('unresolvable')
    } catch (error) {
      expect(error.message).toBe(`Could not resolve ${chalk.bold('unresolvable')}`)
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
  })

  test('executable in node_modules/.bin directory', async () => {
    const args = ['Did', 'something.']
    await runShellCommand('log', args)
    expect(output.trim()).toBe(args.join(' '))

    output = ''
    await runShellCommand('wait-log', args)
    expect(output.trim()).toBe(args.join(' '))

    output = ''
    await runShellCommand('output-error')
    expect(output.trim()).toBe('Error')
  })

  test('echo', async () => {
    const args = ['Did', 'something.']

    await runShellCommand('echo', args)
    expect(output.trim()).toBe(args.join(' '))
  })

  test('cwd', async () => {
    const command = process.platform === 'win32' ? 'cd' : 'pwd'

    await runShellCommand(command)
    expect(output.trim()).toBe(projectDirectoryPath)

    output = ''
    await runShellCommand(command, [], { cwd: projectsDirectoryPath })
    expect(output.trim()).toBe(projectsDirectoryPath)
  })
})
