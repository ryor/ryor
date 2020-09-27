describe('Run shell command', () => {
  const { bold } = require('chalk')
  const { EOL } = require('os')
  const { resolve } = require('path')
  const { ensureCorrectPathValue } = require('../source/ensureCorrectPathValue')
  const { runShellCommand } = require('../source/runShellCommand')
  let args, output

  beforeAll(() => {
    jest.spyOn(process.stderr, 'write').mockImplementation(data => { output += data })
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
    process.chdir(resolve(__dirname, 'test-projects/all'))
    ensureCorrectPathValue()
  })

  beforeEach(() => output = '')

  afterAll(() => jest.restoreAllMocks())

  test('throws error when executable cannot be resolved', async () => {
    try {
      await runShellCommand('unresolvable')
    } catch (error) {
      expect(error.message).toBe(`Could not resolve ${bold('unresolvable')}`)
    }
  })

  test('throws error when subprocess does not exit cleanly', async () => {
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
          if (event === 'error') callback('Some child process error')
          if (event === 'close') callback(1)
        },
        stderr: { on: () => {} },
        stdout: { on: () => {} }
      })
    }))

    try {
      await require('../source/runShellCommand').runShellCommand('command')
    } catch (error) {
      expect(error.message).toBe('Some child process error')
    }

    jest.unmock('cross-spawn')
    jest.resetModules()
  })

  test('cd', async () => {
    await runShellCommand('cd')
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects/all'))
    await runShellCommand('cd', ['..'])
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects'))
    await runShellCommand('cd', ['all'])
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects/all'))
  })

  test('echo', async () => {
    args = ['Did', 'something.']
    await runShellCommand('echo', args)
    expect(output.trim()).toBe(args.join(' '))
  })

  test('executable in node_modules/.bin directory', async () => {
    let result

    args = ['Did', 'something.']
    await runShellCommand('log', args)
    expect(output.trim()).toBe(args.join(' '))

    output = ''
    await runShellCommand('output-error')
    expect(output.trim()).toBe('Error')
  })
})
