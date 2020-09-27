const { resolve } = require('path')

describe('Confirm constant value:', () => {
  test('RUN_DURATION_TEMPLATE', () => {
    expect(require('../source/runCommandLineInput').RUN_DURATION_TEMPLATE).toBe('Completed in [TIME]ms.')
  })
})

describe('Runs CLI input', () => {
  const { bold } = require('chalk')
  const { runCommandLineInput } = require('../source/runCommandLineInput')
  let exitCode, output

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
    jest.spyOn(process, 'exit').mockImplementation(code => { exitCode = code })
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('outputs error message when "unresolvable" cannot be resolved', async () => {
    await runCommandLineInput(['unresolvable'])
    expect(output.trim()).toBe(`Could not resolve ${bold('unresolvable')}`)
    expect(exitCode).toBe(1)
  })

  test('outputs error message when "bundler" runnable is resolved and contains syntax error', async () => {
    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))
    await runCommandLineInput(['bundler'])
    expect(output.includes('SyntaxError')).toBe(true)
    expect(exitCode).toBe(1)
  })

  test('resolves and runs "transpiler" runnable in "only-tools" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-tools'))
    await runCommandLineInput(['transpiler'])
    expect(output.trim()).toBe('transpiling')
    expect(exitCode).toBe(0)
  })

  test('outputs main usage information for "all" test project when no args are passed to run function', async () => {
    const cliTruncate = require('cli-truncate')
    const { EOL } = require('os')
    const { getOutputColumnCount } = require('../source/getOutputColumnCount')
    const expectedMainUsageInformation = require('./test-projects/expectedMainUsageInformation')
    const expectedOutput = `${EOL}${expectedMainUsageInformation['all'].split(EOL).map(line => cliTruncate(line, getOutputColumnCount())).join(EOL)}${EOL}`

    process.chdir(resolve(__dirname, 'test-projects/all'))

    await runCommandLineInput()
    expect(output).toBe(expectedOutput)
    expect(exitCode).toBe(0)

    output = ''
    await runCommandLineInput([])
    expect(output).toBe(expectedOutput)
    expect(exitCode).toBe(0)

    output = ''
    await runCommandLineInput(['help'])
    expect(output).toBe(expectedOutput)
    expect(exitCode).toBe(0)
  })
})
