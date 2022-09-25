import chalk from 'chalk'
import { resolve } from 'path'
import { runShellCommand } from '../../source/runnables/runShellCommand'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'

describe('Run shell command', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
  let output

  beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation((data) => {
      output += data
    })
    jest.spyOn(process.stderr, 'write').mockImplementation((data) => {
      output += data
    })
    jest.spyOn(process.stdout, 'write').mockImplementation((data) => {
      output += data
    })
    process.chdir(projectDirectoryPath)
    await ensureCorrectPATHValue()
  })

  beforeEach(() => {
    output = ''
    process.chdir(projectDirectoryPath)
  })

  afterAll(() => jest.restoreAllMocks())

  test('throws error when executable cannot be resolved', async () => {
    await expect(runShellCommand('unresolvable')).rejects.toThrow(`Could not resolve ${chalk.bold('unresolvable')}`)
  })

  test('throws error when child process does not exit cleanly', async () => {
    await expect(runShellCommand('fail')).rejects.toThrow('')
    await expect(runShellCommand('node-error')).rejects.toThrow('')
    expect(output.includes('ERR_INVALID_ARG_TYPE')).toBe(true)
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

  test('wd', async () => {
    await runShellCommand('wd')
    expect(output.trim()).toBe(projectDirectoryPath)

    output = ''
    await runShellCommand('wd', [], { cwd: projectsDirectoryPath })
    expect(output.trim()).toBe(projectsDirectoryPath)
  })
})
