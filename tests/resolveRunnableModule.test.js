/* eslint-env jest */

import { resolve } from 'path'
import { INVALID_RUNNABLE_ERROR_TEMPLATE, NO_RUNNABLE_ERROR_TEMPLATE } from '../source/requireModule'
import { resolveRunnableModule } from '../source/resolveRunnableModule'

describe('Resolve runnable module', () => {
  test('undefined when module cannot be resolved', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/empty-runnables-directory')

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('runnable', resolve(projectDirectoryPath, 'run'))).toBeUndefined()
  })

  test('throws Error when module contains syntax error', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/syntax-error')

    process.chdir(projectDirectoryPath)

    try {
      await resolveRunnableModule('bundler', resolve(projectDirectoryPath, 'run'))
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
      await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))
    } catch (error) {
      expect(error.message).toBe(NO_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }

    name = 'tester'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }

    name = 'transpiler'
    path = require.resolve(resolve(projectDirectoryPath, 'run', name)).replace(projectDirectoryPath, '.')

    try {
      await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))
    } catch (error) {
      expect(error.message).toBe(INVALID_RUNNABLE_ERROR_TEMPLATE.replace('[PATH]', path))
    }
  })

  test('in "only-tools" test project', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/only-tools')
    let name

    process.chdir(projectDirectoryPath)

    name = 'bundler'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'tester'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'transpiler'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()
  })

  test('in "only-untyped" test project', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/only-untyped')
    let name

    process.chdir(projectDirectoryPath)

    name = 'build'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'deploy'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'test'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()
  })

  test('in "all" test project', async () => {
    const projectDirectoryPath = resolve(__dirname, 'test-projects/all')
    let name

    process.chdir(projectDirectoryPath)

    name = 'git'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'bundler'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'transpiler'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()

    name = 'tester'
    expect(await resolveRunnableModule(name, resolve(projectDirectoryPath, 'run'))).toBeDefined()
  })
})
