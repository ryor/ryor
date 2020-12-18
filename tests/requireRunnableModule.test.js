/* eslint-env jest */

import { resolve } from 'path'
import { INVALID_RUNNABLE_ERROR_TEMPLATE, NO_RUNNABLE_ERROR_TEMPLATE, requireRunnableModule } from '../source/requireRunnableModule'

describe('Confirm constant values:', () => {
  test('INVALID_RUNNABLE_ERROR_TEMPLATE', () => expect(INVALID_RUNNABLE_ERROR_TEMPLATE).toBe('Invalid runnable defined in [PATH]'))
  test('NO_RUNNABLE_ERROR_TEMPLATE', () => expect(NO_RUNNABLE_ERROR_TEMPLATE).toBe('No runnable defined in [PATH]'))
})

describe('Require runnable module(s)', () => {
  test('throws errors when runnable modules are invalid', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/invalid-definitions')
    let path, abbreviatedPath

    process.chdir(projectDirectoryPath)

    path = resolve(projectDirectoryPath, 'run', 'bundler')
    abbreviatedPath = require.resolve(path).replace(projectDirectoryPath, '.')

    try {
      await requireRunnableModule(path)
    } catch (error) {
      expect(error.message).toBe(NO_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', abbreviatedPath))
    }

    path = resolve(projectDirectoryPath, 'run', 'linter')
    abbreviatedPath = require.resolve(path).replace(projectDirectoryPath, '.')

    try {
      await requireRunnableModule(path)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', abbreviatedPath))
    }

    path = resolve(projectDirectoryPath, 'run', 'tester')
    abbreviatedPath = require.resolve(path).replace(projectDirectoryPath, '.')

    try {
      await requireRunnableModule(path)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', abbreviatedPath))
    }

    path = resolve(projectDirectoryPath, 'run', 'transpiler')
    abbreviatedPath = require.resolve(path).replace(projectDirectoryPath, '.')

    try {
      await requireRunnableModule(path)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', abbreviatedPath))
    }
  })

  /*
  test('undefined when runnable modules directory cannot be resolved', async () => {
    process.chdir(resolve(__dirname, 'test-projects/empty'))

    expect(await resolveRunnableModule('runnable')).toBeUndefined()
  })

  test('undefined when module cannot be resolved', async () => {
    process.chdir(resolve(__dirname, 'test-projects/empty-runnables-directory'))

    expect(await resolveRunnableModule('runnable')).toBeUndefined()
  })

  test('throws Error when module contains syntax error', async () => {
    process.chdir(resolve(__dirname, 'test-projects/syntax-error'))

    try {
      await resolveRunnableModule('bundler')
    } catch (error) {
      expect(error.name).toBe('SyntaxError')
    }
  })

  test('throws errors when modules are invalid', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/invalid-definitions')
    let name

    process.chdir(projectDirectoryPath)

    name = 'bundler'

    try {
      await resolveRunnableModule(name)
    } catch (error) {
      expect(error.message).toBe(`Invalid runnable definition in ${resolve(projectDirectoryPath, 'run', name)}`)
    }

    name = 'tester'

    try {
      await resolveRunnableModule(name)
    } catch (error) {
      expect(error.message).toBe(`Invalid runnable definition in ${resolve(projectDirectoryPath, 'run', name)}`)
    }

    name = 'transpiler'

    try {
      await resolveRunnableModule(name)
    } catch (error) {
      expect(error.message).toBe(`Invalid runnable definition in ${resolve(projectDirectoryPath, 'run', name)}`)
    }
  })
  */

  test('in "only-tools" test project', async () => {
    const projectRunnablesPath = resolve(__dirname, 'test-projects/only-tools/run')

    expect(requireRunnableModule(resolve(projectRunnablesPath, 'tools/bundler'))).toBeDefined()
    expect(requireRunnableModule(resolve(projectRunnablesPath, 'tools/tester'))).toBeDefined()
    expect(requireRunnableModule(resolve(projectRunnablesPath, 'tools/transpiler'))).toBeDefined()
  })

  test('in "all" test project', async () => {
    const projectRunnablesPath = resolve(__dirname, 'test-projects/all/run')

    expect(requireRunnableModule(resolve(projectRunnablesPath, 'git'))).toBeDefined()
    expect(requireRunnableModule(resolve(projectRunnablesPath, 'tools/bundler'))).toBeDefined()
    expect(requireRunnableModule(resolve(projectRunnablesPath, 'tasks/build'))).toBeDefined()
  })
})
