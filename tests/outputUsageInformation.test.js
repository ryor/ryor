/* eslint-env jest */

import cliTruncate from 'cli-truncate'
import { EOL } from 'os'
import { resolve } from 'path'
import { NO_RUNNABLES_RESOLVED_MESSAGE } from '../source/composeMainUsageInformation'
import { HEADER_TEMPLATE } from '../source/composeRunnableUsageInformation'
import { getOutputColumnCount } from '../source/getOutputColumnCount'
import { outputUsageInformation } from '../source/outputUsageInformation'
import expectedMainUsageInformation from './test-projects/expectedMainUsageInformation'

describe('Output usage information', () => {
  let output

  beforeAll(() => jest.spyOn(console, 'log').mockImplementation(message => { output += `${output === '' ? '' : '\n'}${message}` }))

  afterAll(() => jest.restoreAllMocks())

  test('NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    output = ''
    process.chdir(resolve(__dirname, 'test-projects/empty'))
    await outputUsageInformation()
    expect(output).toBe(EOL + NO_RUNNABLES_RESOLVED_MESSAGE + EOL)

    output = ''
    process.chdir(resolve(__dirname, 'test-projects/empty-run'))
    await outputUsageInformation()
    expect(output).toBe(EOL + NO_RUNNABLES_RESOLVED_MESSAGE + EOL)

    output = ''
    process.chdir(resolve(__dirname, 'test-projects/invalid-definitions'))
    await outputUsageInformation()
    expect(output).toBe(EOL + NO_RUNNABLES_RESOLVED_MESSAGE + EOL)

    output = ''
    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))
    await outputUsageInformation()
    expect(output).toBe(EOL + NO_RUNNABLES_RESOLVED_MESSAGE + EOL)
  })

  test('for "all" test project', async () => {
    const outputColumnCount = getOutputColumnCount()
    let runnableName

    process.chdir(resolve(__dirname, 'test-projects/all'))

    output = ''
    await outputUsageInformation()
    expect(output).toBe(`${EOL}${expectedMainUsageInformation.all.split(EOL).map(line => cliTruncate(line, outputColumnCount)).join(EOL)}${EOL}`)

    output = ''
    runnableName = 'unresolvable'
    await outputUsageInformation(runnableName)
    expect(output).toBe(`${EOL}${expectedMainUsageInformation.all.split(EOL).map(line => cliTruncate(line, outputColumnCount)).join(EOL)}${EOL}`)

    output = ''
    runnableName = 'build'
    await outputUsageInformation(runnableName)
    expect(output).toBe(EOL + cliTruncate(HEADER_TEMPLATE.replace('[NAME]', runnableName), outputColumnCount) + EOL)

    output = ''
    runnableName = 'deploy'
    await outputUsageInformation(runnableName)
    expect(output).toBe(EOL + cliTruncate([HEADER_TEMPLATE.replace('[NAME]', runnableName), 'Deploys project'].join(EOL + EOL), outputColumnCount) + EOL)
  })
})
