import { resolve } from 'path'
import { getConsoleColumnCount } from '../../source/console/getConsoleColumnCount'
import { truncateConsoleOutput } from '../../source/console/truncateConsoleOutput'
import { LINE_BREAK } from '../../source/shared/constants'
import { NO_RUNNABLES_RESOLVED_MESSAGE } from '../../source/usage/constants'
import { outputUsageInformation } from '../../source/usage/outputUsageInformation'

describe('Output usage information', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const usageInformationDirectoryPath = resolve(__dirname, '../.test-projects/usage-information')
  let output

  beforeAll(() =>
    jest.spyOn(console, 'log').mockImplementation((message) => {
      output += `${output === '' ? '' : '\n'}${message}`
    })
  )

  afterAll(() => jest.restoreAllMocks())

  test('NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    let configuration, directory, modules, projectDirectoryPath

    projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')
    directory = resolve(projectDirectoryPath, 'tasks')
    modules = []
    configuration = { directory, modules }
    output = ''
    process.chdir(projectDirectoryPath)
    await outputUsageInformation(configuration)
    expect(output).toBe(LINE_BREAK + NO_RUNNABLES_RESOLVED_MESSAGE + LINE_BREAK)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'invalid-definitions')
    directory = resolve(projectDirectoryPath, 'tasks')
    modules = ['bundler', 'linter', 'tester', 'transpiler']
    configuration = { directory, modules }
    output = ''
    process.chdir(projectDirectoryPath)
    await outputUsageInformation(configuration)
    expect(output).toBe(LINE_BREAK + NO_RUNNABLES_RESOLVED_MESSAGE + LINE_BREAK)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')
    directory = resolve(projectDirectoryPath, 'tasks')
    modules = ['bundler']
    configuration = { directory, modules }
    output = ''
    process.chdir(projectDirectoryPath)
    await outputUsageInformation(configuration)
    expect(output).toBe(LINE_BREAK + NO_RUNNABLES_RESOLVED_MESSAGE + LINE_BREAK)
  })

  test('for "all" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const directory = resolve(projectDirectoryPath, 'tasks')
    // prettier-ignore
    const modules = [
      ['build', 'main'],
      ['deploy', 'main'],
      ['test', 'main'],
      ['bundler', 'tools'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['git'],
      ['npm']
    ]
    const configuration = { directory, modules }
    const { build, bundler, main, tester, transpiler, git } = require(resolve(usageInformationDirectoryPath, 'all'))

    process.chdir(projectDirectoryPath)

    output = ''
    await outputUsageInformation(configuration)
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(main, getConsoleColumnCount())}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'unresolvable')
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(main, getConsoleColumnCount())}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'build')
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(build, getConsoleColumnCount())}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'bundler')
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(bundler, getConsoleColumnCount())}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'tester')
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(tester, getConsoleColumnCount())}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'transpiler')
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(transpiler, getConsoleColumnCount())}${LINE_BREAK}`)

    output = ''
    await outputUsageInformation(configuration, 'git')
    expect(output).toBe(`${LINE_BREAK}${truncateConsoleOutput(git, getConsoleColumnCount())}${LINE_BREAK}`)
  })
})
