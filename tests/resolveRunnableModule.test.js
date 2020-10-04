/* eslint-env jest */

import { resolve } from 'path'
import { INVALID_RUNNABLE_ERROR_TEMPLATE, NO_RUNNABLE_ERROR_TEMPLATE } from '../source/requireRunnableModule'
import { resolveRunnableModule } from '../source/resolveRunnableModule'

describe('Resolve runnable module(s)', () => {
  test('undefined when runnable modules directory cannot be resolved', async () => {
    process.chdir(resolve(__dirname, 'test-projects/empty'))

    expect(await resolveRunnableModule('runnable')).toBeUndefined()
  })

  test('undefined when module cannot be resolved', async () => {
    process.chdir(resolve(__dirname, 'test-projects/empty-run'))

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
    let name, path

    process.chdir(projectDirectoryPath)

    name = 'bundler'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await resolveRunnableModule(name)
    } catch (error) {
      expect(error.message).toBe(NO_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }

    name = 'tester'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await resolveRunnableModule(name)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }

    name = 'transpiler'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await resolveRunnableModule(name)
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }
  })

  test('in "only-tools" test project', async () => {
    let name

    process.chdir(resolve(__dirname, 'test-projects/only-tools'))

    name = 'bundler'
    expect(await resolveRunnableModule(name)).toBeDefined()

    name = 'tester'
    expect(await resolveRunnableModule(name)).toBeDefined()

    name = 'transpiler'
    expect(await resolveRunnableModule(name)).toBeDefined()
  })

  test('in "all" test project', async () => {
    let name

    process.chdir(resolve(__dirname, 'test-projects/all'))

    name = 'git'
    expect(await resolveRunnableModule(name)).toBeDefined()

    name = 'bundler'
    expect(await resolveRunnableModule(name)).toBeDefined()

    name = 'transpiler'
    expect(await resolveRunnableModule(name)).toBeDefined()

    name = 'tester'
    expect(await resolveRunnableModule(name)).toBeDefined()
  })
})
