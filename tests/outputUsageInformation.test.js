describe('Output usage information', () => {
  const cliTruncate = require('cli-truncate')
  const { EOL } = require('os')
  const { resolve } = require('path')
  const { NO_RUNNABLES_RESOLVED_MESSAGE } = require('../source/composeMainUsageInformation')
  const { HEADER_TEMPLATE } = require('../source/composeRunnableUsageInformation')
  const { outputUsageInformation } = require('../source/outputUsageInformation')
  const expectedMainUsageInformation = require('./test-projects/expectedMainUsageInformation')
  let consoleLogMock, output

  beforeAll(() => {
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation(message => { output += `${output === '' ? '' : '\n'}${message}` })
  })

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
    const { getOutputColumnCount } = require('../source/getOutputColumnCount')
    const outputColumnCount =  getOutputColumnCount()
    let expectedOutput, runnableName

    process.chdir(resolve(__dirname, 'test-projects/all'))

    output = ''
    await outputUsageInformation()
    expectedOutput = `${EOL}${expectedMainUsageInformation['all'].split(EOL).map(line => cliTruncate(line, outputColumnCount)).join(EOL)}${EOL}`
    expect(output).toBe(expectedOutput)

    output = ''
    runnableName = 'unresolvable'
    await outputUsageInformation(runnableName)
    expect(output).toBe(`${EOL}${expectedMainUsageInformation['all'].split(EOL).map(line => cliTruncate(line, outputColumnCount)).join(EOL)}${EOL}`)

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
