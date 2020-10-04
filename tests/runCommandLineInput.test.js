/* eslint-env jest */

import { bold } from 'chalk'
import cliTruncate from 'cli-truncate'
import { EOL } from 'os'
import { resolve } from 'path'
import { getOutputColumnCount } from '../source/getOutputColumnCount'
import { DURATION_TEMPLATE, runCommandLineInput } from '../source/runCommandLineInput'
import expectedMainUsageInformation from './test-projects/expectedMainUsageInformation'

describe('Confirm constant value:', () => {
  test('DURATION_TEMPLATE', () => expect(DURATION_TEMPLATE).toBe('Completed in [DURATION]ms.'))
})

describe('Runs CLI input', () => {
  let exitCode, output

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(data => { output += data + EOL })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data + EOL })
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

    output = ''
    await runCommandLineInput(['-d', 'transpiler'])
    expect(output.trim()).toMatch(new RegExp('transpiling' + EOL + 'Completed in ([0-9]+)ms.'))
    expect(exitCode).toBe(0)
  })

  test('outputs main usage information for "all" test project when no args are passed to run function', async () => {
    const expectedOutput = `${expectedMainUsageInformation.all.split(EOL).map(line => cliTruncate(line, getOutputColumnCount())).join(EOL)}`

    process.chdir(resolve(__dirname, 'test-projects/all'))

    await runCommandLineInput()
    expect(output.trim()).toBe(expectedOutput)
    expect(exitCode).toBe(0)

    output = ''
    await runCommandLineInput([])
    expect(output.trim()).toBe(expectedOutput)
    expect(exitCode).toBe(0)

    output = ''
    await runCommandLineInput(['-d'])
    expect(output.trim()).toMatch(/Completed in ([0-9]+)ms.$/)
    expect(exitCode).toBe(0)

    output = ''
    await runCommandLineInput(['-d', 'help'])
    expect(output.trim()).toMatch(/Completed in ([0-9]+)ms.$/)
    expect(exitCode).toBe(0)
  })
})
