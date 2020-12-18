/* eslint-env jest */

import { bold } from 'chalk'
import cliTruncate from 'cli-truncate'
import { EOL } from 'os'
import { resolve } from 'path'
import { getOutputColumnCount } from '../source/getOutputColumnCount'
import { DURATION_TEMPLATE, run } from '../source/run'
import expectedMainUsageInformation from './test-projects/expectedMainUsageInformation'

describe('Confirm constant value:', () => {
  test('DURATION_TEMPLATE', () => expect(DURATION_TEMPLATE).toBe('Completed in [DURATION]ms.'))
})

describe('Starts runner with inputs', () => {
  let exitCode, output

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(data => { output += data + EOL })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data + EOL })
    jest.spyOn(process, 'exit').mockImplementation(code => { exitCode = code })
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('outputs error message when "unresolvable" cannot be resolved', async () => {
    await run([...process.argv.slice(0, 2), 'unresolvable'])
    expect(output.trim()).toBe(`Could not resolve ${bold('unresolvable')}`)
    expect(exitCode).toBe(1)
  })

  test('outputs error message when "bundler" runnable is resolved and contains syntax error', async () => {
    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))

    await run([process.argv[0], resolve(__dirname, 'test-projects/syntax-error/run'), 'bundler'])
    expect(output.includes('SyntaxError')).toBe(true)
    expect(exitCode).toBe(1)
    expect(1).toBe(1)
  })

  test('resolves and runs "transpiler" runnable in "only-tools" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-tools'))

    await run([process.argv[0], resolve(__dirname, 'test-projects/only-tools/run'), 'transpiler'])
    expect(output.trim()).toBe('transpiling')
    expect(exitCode).toBe(0)

    output = ''
    await run([process.argv[0], resolve(__dirname, 'test-projects/only-tools/run'), '-d', 'transpiler'])
    expect(output.trim()).toMatch(new RegExp('transpiling' + EOL + 'Completed in ([0-9]+)ms.'))
    expect(exitCode).toBe(0)
  })

  test('outputs main usage information for "all" test project when no args are passed to run function', async () => {
    const expectedOutput = `${expectedMainUsageInformation.all.split(EOL).map(line => cliTruncate(line, getOutputColumnCount())).join(EOL)}`

    process.chdir(resolve(__dirname, 'test-projects/all'))

    await run([process.argv[0], resolve(__dirname, 'test-projects/all/run')])
    expect(output.trim()).toBe(expectedOutput)
    expect(exitCode).toBe(0)

    output = ''
    await run([process.argv[0], resolve(__dirname, 'test-projects/all/run'), '-d'])
    expect(output.trim()).toMatch(/Completed in ([0-9]+)ms.$/)
    expect(exitCode).toBe(0)

    output = ''
    await run([process.argv[0], resolve(__dirname, 'test-projects/all/run'), '--duration', 'help'])
    expect(output.trim()).toMatch(/Completed in ([0-9]+)ms.$/)
    expect(exitCode).toBe(0)
  })
})
