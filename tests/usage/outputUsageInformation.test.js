/* eslint-env jest */

import cliTruncate from 'cli-truncate'
import { resolve } from 'path'
import { getConsoleColumnCount } from '../../source/console/getConsoleColumnCount'
import { LINE_BREAK } from '../../source/shared/constants'
import { outputUsageInformation } from '../../source/usage/outputUsageInformation'
import { NO_RUNNABLES_RESOLVED_MESSAGE } from '../../source/usage/constants'

describe('Output usage information', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const usageInformationDirectoryPath = resolve(__dirname, '../.test-projects/usage-information')
  let output

  beforeAll(() => jest.spyOn(console, 'log').mockImplementation(message => { output += `${output === '' ? '' : '\n'}${message}` }))

  afterAll(() => jest.restoreAllMocks())

  test('NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    let configuration, projectDirectoryPath

    projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')
    configuration = { directory: resolve(projectDirectoryPath, 'run') }
    output = ''
    process.chdir(projectDirectoryPath)
    await outputUsageInformation(configuration)
    expect(output).toBe(LINE_BREAK + NO_RUNNABLES_RESOLVED_MESSAGE + LINE_BREAK)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'invalid-definitions')
    configuration = { directory: resolve(projectDirectoryPath, 'run') }
    output = ''
    process.chdir(projectDirectoryPath)
    await outputUsageInformation(configuration)
    expect(output).toBe(LINE_BREAK + NO_RUNNABLES_RESOLVED_MESSAGE + LINE_BREAK)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')
    configuration = { directory: resolve(projectDirectoryPath, 'run') }
    output = ''
    process.chdir(projectDirectoryPath)
    await outputUsageInformation(configuration)
    expect(output).toBe(LINE_BREAK + NO_RUNNABLES_RESOLVED_MESSAGE + LINE_BREAK)
  })

  test('for "all" test project', async () => {
    const outputColumnCount = getConsoleColumnCount()
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const configuration = { directory: resolve(projectDirectoryPath, 'run') }
    const { build, bundler, main, tester, transpiler, git } = require(resolve(usageInformationDirectoryPath, 'all'))
    let runnableName

    process.chdir(projectDirectoryPath)

    output = ''
    await outputUsageInformation(configuration)
    expect(output).toBe(`${LINE_BREAK}${main.split(LINE_BREAK).map(line => cliTruncate(line, outputColumnCount)).join(LINE_BREAK)}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'unresolvable')
    expect(output).toBe(`${LINE_BREAK}${main.split(LINE_BREAK).map(line => cliTruncate(line, outputColumnCount)).join(LINE_BREAK)}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'build')
    expect(output).toBe(LINE_BREAK + cliTruncate(build, outputColumnCount) + LINE_BREAK)

    output = ''
    await outputUsageInformation(configuration, 'bundler')
    expect(output).toBe(LINE_BREAK + cliTruncate(bundler, outputColumnCount) + LINE_BREAK)

    output = ''
    await outputUsageInformation(configuration, 'tester')
    expect(output).toBe(LINE_BREAK + cliTruncate(tester, outputColumnCount) + LINE_BREAK)

    output = ''
    await outputUsageInformation(configuration, 'transpiler')
    expect(output).toBe(LINE_BREAK + cliTruncate(transpiler, outputColumnCount) + LINE_BREAK)

    output = ''
    await outputUsageInformation(configuration, 'git')
    expect(output).toBe(LINE_BREAK + cliTruncate(git, outputColumnCount) + LINE_BREAK)
  })
})
