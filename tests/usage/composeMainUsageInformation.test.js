import { resolve } from 'path'
import { composeMainUsageInformation } from '../../source/usage/composeMainUsageInformation'
import { NO_RUNNABLES_RESOLVED_MESSAGE } from '../../source/usage/constants'

describe('Compose main usage information', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const usageInformationDirectoryPath = resolve(__dirname, '../.test-projects/usage-information')

  test('returns NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    let directory, modules, projectDirectoryPath

    projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')
    directory = resolve(projectDirectoryPath, 'tasks')
    modules = []
    process.chdir(projectDirectoryPath)
    expect(await composeMainUsageInformation({ directory, modules })).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'invalid-definitions')
    directory = resolve(projectDirectoryPath, 'tasks')
    modules = ['bundler', 'linter', 'tester', 'transpiler']
    process.chdir(projectDirectoryPath)
    expect(await composeMainUsageInformation({ directory, modules })).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')
    directory = resolve(projectDirectoryPath, 'tasks')
    modules = ['bundler']
    process.chdir(projectDirectoryPath)
    expect(await composeMainUsageInformation({ directory, modules })).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)
  })

  test('for "no-nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'no-nested-directories')
    const directory = resolve(projectDirectoryPath, 'tasks')
    const modules = [['build'], ['deploy'], ['test']]
    const expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'no-nested-directories'))

    process.chdir(projectDirectoryPath)

    expect(await composeMainUsageInformation({ directory, modules })).toBe(expectedUsageInformation.main)
  })

  test('for "nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'nested-directories')
    const directory = resolve(projectDirectoryPath, 'tasks')
    // prettier-ignore
    const modules = [
      ['build', 'main'],
      ['bundler', 'tools'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['commit', 'version-control']
    ]
    const expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'nested-directories'))

    process.chdir(projectDirectoryPath)

    expect(await composeMainUsageInformation({ directory, modules })).toBe(expectedUsageInformation.main)
  })

  test('for "all" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const directory = resolve(projectDirectoryPath, 'tasks')
    // prettier-ignore
    let modules = [
      ['build', 'main'],
      ['deploy', 'main'],
      ['test', 'main'],
      ['bundler', 'tools'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['git'],
      ['npm']
    ]
    let expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'all'))

    process.chdir(projectDirectoryPath)

    expect(await composeMainUsageInformation({ directory, modules })).toBe(expectedUsageInformation.main)

    // prettier-ignore
    modules = [
      ['bundler', 'tools'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['build', 'main'],
      ['deploy', 'main'],
      ['test', 'main'],
      ['git'],
      ['npm']
    ]

    expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'all'))

    expect(await composeMainUsageInformation({ directory, modules })).toBe(expectedUsageInformation.mainSorted)
  })
})
