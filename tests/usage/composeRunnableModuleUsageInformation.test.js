/* eslint-env jest */

import { resolve } from 'path'
import { composeRunnableModuleUsageInformation } from '../../source/usage/composeRunnableModuleUsageInformation'
import { UNRESOLVED_RUNNABLE_ERROR_MESSAGE } from '../../source/usage/constants'

describe('Compose runnable module usage information', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const usageInformationDirectoryPath = resolve(__dirname, '../.test-projects/usage-information')

  test('throws Error when runnable module cannot be resolved', async () => {
    const runnableName = 'unresolvable'

    try {
      await composeRunnableModuleUsageInformation(runnableName, { directory: resolve(process.cwd(), 'run') })
    } catch (error) {
      expect(error.message).toBe(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', runnableName))
    }
  })

  test('throws Error when runnable module can\'t be resolved', async () => {
    let configuration, projectDirectoryPath, runnableName

    projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')
    configuration = { directory: resolve(projectDirectoryPath, 'run') }
    runnableName = 'bundler'

    process.chdir(projectDirectoryPath)

    try {
      await composeRunnableModuleUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', runnableName))
    }

    projectDirectoryPath = resolve(projectsDirectoryPath, 'invalid-definitions')
    configuration = { directory: resolve(projectDirectoryPath, 'run') }

    process.chdir(projectDirectoryPath)

    try {
      await composeRunnableModuleUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', runnableName))
    }

    runnableName = 'linter'

    try {
      await composeRunnableModuleUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', runnableName))
    }

    runnableName = 'tester'

    try {
      await composeRunnableModuleUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', runnableName))
    }

    runnableName = 'transpiler'

    try {
      await composeRunnableModuleUsageInformation(runnableName, configuration)
    } catch (error) {
      expect(error.message).toBe(UNRESOLVED_RUNNABLE_ERROR_MESSAGE.replace('[NAME]', runnableName))
    }
  })

  test('for runnables in "no-nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'no-nested-directories')
    const configuration = { directory: resolve(projectDirectoryPath, 'tasks') }
    const { build, deploy, test } = require(resolve(usageInformationDirectoryPath, 'no-nested-directories'))

    process.chdir(projectDirectoryPath)

    expect(await composeRunnableModuleUsageInformation('build', configuration)).toBe(build)
    expect(await composeRunnableModuleUsageInformation('deploy', configuration)).toBe(deploy)
    expect(await composeRunnableModuleUsageInformation('test', configuration)).toBe(test)
  })

  /*
  test('for runnables in "nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'nested-directories')
    const configuration = await configure(['node', resolve(projectDirectoryPath, 'run')])
    const { bundler, tester, transpiler } = require(resolve(usageInformationDirectoryPath, 'nested-directories'))

    process.chdir(projectDirectoryPath)

    expect(await composeRunnableModuleUsageInformation('bundler', configuration)).toBe(bundler)
    expect(await composeRunnableModuleUsageInformation('tester', configuration)).toBe(tester)
    expect(await composeRunnableModuleUsageInformation('transpiler', configuration)).toBe(transpiler)
  })

  test('for runnables in "all" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const configuration = await configure(['node', resolve(projectDirectoryPath, 'run')])
    const { git, bundler, tester, transpiler } = require(resolve(usageInformationDirectoryPath, 'all'))

    process.chdir(projectDirectoryPath)

    expect(await composeRunnableModuleUsageInformation('git', configuration)).toBe(git)
    expect(await composeRunnableModuleUsageInformation('bundler', configuration)).toBe(bundler)
    expect(await composeRunnableModuleUsageInformation('tester', configuration)).toBe(tester)
    expect(await composeRunnableModuleUsageInformation('transpiler', configuration)).toBe(transpiler)
  })

  test('for runnables in "multiple-commands" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'multiple-commands')
    const configuration = await configure(['node', resolve(projectDirectoryPath, 'run')])
    const { gitflow } = require(resolve(usageInformationDirectoryPath, 'multiple-commands'))

    process.chdir(projectDirectoryPath)

    expect(await composeRunnableModuleUsageInformation('gitflow', configuration)).toBe(gitflow)
  })
  */
})
