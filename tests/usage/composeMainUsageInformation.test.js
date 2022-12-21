import { resolve } from 'path'
import { composeMainUsageInformation } from '../../source/usage/composeMainUsageInformation'
import { NO_RUNNABLES_RESOLVED_MESSAGE } from '../../source/usage/constants'

describe('Compose main usage information', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const usageInformationDirectoryPath = resolve(__dirname, '../.test-projects/usage-information')

  test('returns NO_RUNNABLES_RESOLVED_MESSAGE when no valid runnables are resolved', async () => {
    let configuration, projectDirectoryPath

    projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')
    configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    process.chdir(projectDirectoryPath)
    expect(await composeMainUsageInformation(configuration)).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'invalid-definitions')
    configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    process.chdir(projectDirectoryPath)
    expect(await composeMainUsageInformation(configuration)).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)

    projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')
    configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    process.chdir(projectDirectoryPath)
    expect(await composeMainUsageInformation(configuration)).toBe(NO_RUNNABLES_RESOLVED_MESSAGE)
  })

  test('for "no-nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'no-nested-directories')
    const configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    const expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'no-nested-directories'))

    process.chdir(projectDirectoryPath)

    expect(await composeMainUsageInformation(configuration)).toBe(expectedUsageInformation.main)
  })

  test('for "nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'nested-directories')
    const configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    const expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'nested-directories'))

    process.chdir(projectDirectoryPath)

    expect(await composeMainUsageInformation(configuration)).toBe(expectedUsageInformation.main)
  })

  test('for "all" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    const expectedUsageInformation = require(resolve(usageInformationDirectoryPath, 'all'))

    process.chdir(projectDirectoryPath)

    expect(await composeMainUsageInformation(configuration)).toBe(expectedUsageInformation.main)
    expect(await composeMainUsageInformation({ ...configuration, usage: { categories: ['tools'] } })).toBe(expectedUsageInformation.mainSorted)
    expect(await composeMainUsageInformation({ ...configuration, usage: { categories: ['tools', 'tasks'] } })).toBe(expectedUsageInformation.mainSorted)
    expect(await composeMainUsageInformation({ ...configuration, usage: { categories: ['foo', 'tools'] } })).toBe(expectedUsageInformation.mainSorted)
    expect(await composeMainUsageInformation({ ...configuration, usage: { categories: ['foo', 'tools', 'foo2', 'tasks'] } })).toBe(
      expectedUsageInformation.mainSorted
    )
  })
})
