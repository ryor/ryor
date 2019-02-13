/* eslint-env jest */
const { resolve } = require('path')
const { clear, getPossibleModuleTypes, resolveAllRunnableModules, resolveRunnableModule } = require('../modules')
const rootDirectoryPath = resolve(__dirname, '../../..')

test('Gets possible module types', () => {
  let types

  process.chdir(resolve(rootDirectoryPath, `test-projects/empty`))
  types = getPossibleModuleTypes()
  expect(types).toEqual([])

  process.chdir(resolve(rootDirectoryPath, `test-projects/empty-run`))
  types = getPossibleModuleTypes()
  expect(types).toEqual([])

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-bin`))
  types = getPossibleModuleTypes()
  expect(types).toEqual([])

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-tasks`))
  clear()
  types = getPossibleModuleTypes()
  expect(types).toEqual(['tasks'])

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-tools`))
  clear()
  types = getPossibleModuleTypes()
  expect(types).toEqual(['tools'])

  process.chdir(resolve(rootDirectoryPath, `test-projects/syntax-error`))
  clear()
  types = getPossibleModuleTypes()
  expect(types).toEqual(['tools'])

  process.chdir(resolve(rootDirectoryPath, `test-projects/all`))
  clear()
  types = getPossibleModuleTypes()
  expect(types).toEqual(['tasks', 'tools'])

  process.chdir(rootDirectoryPath)
})

test('Resolves all runnable modules', () => {
  let modules

  process.chdir(resolve(rootDirectoryPath, `test-projects/empty`))
  modules = resolveAllRunnableModules()
  expect(modules).toBeInstanceOf(Map)
  expect(modules.size).toBe(0)

  process.chdir(resolve(rootDirectoryPath, `test-projects/empty-run`))
  clear()
  modules = resolveAllRunnableModules()
  expect(modules.size).toBe(0)

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-bin`))
  clear()
  modules = resolveAllRunnableModules()
  expect(modules.size).toBe(0)

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-tasks`))
  clear()
  modules = resolveAllRunnableModules()
  expect(modules.size).toBe(1)
  expect(Array.from(modules.keys())).toEqual(['tasks'])
  expect(Array.from(modules.get('tasks').keys())).toEqual(['build', 'deploy', 'test'])

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-tools`))
  clear()
  modules = resolveAllRunnableModules()
  expect(modules.size).toBe(1)
  expect(Array.from(modules.keys())).toEqual(['tools'])
  expect(Array.from(modules.get('tools').keys())).toEqual(['bundler', 'tester', 'transpiler'])

  process.chdir(resolve(rootDirectoryPath, `test-projects/all`))
  clear()
  modules = resolveAllRunnableModules()
  expect(modules.size).toBe(2)
  expect(Array.from(modules.keys())).toEqual(['tasks', 'tools'])
  expect(Array.from(modules.get('tasks').keys())).toEqual(['build', 'deploy', 'test'])
  expect(Array.from(modules.get('tools').keys())).toEqual(['bundler', 'tester', 'transpiler'])

  process.chdir(rootDirectoryPath)
})

test('Throws error when attempt is made to resolve module with syntax error', () => {
  process.chdir(resolve(rootDirectoryPath, `test-projects/syntax-error`))
  clear()
  expect(() => resolveRunnableModule('bundler')).toThrow()
  jest.resetModules()
  expect(() => resolveAllRunnableModules()).toThrow()
  process.chdir(rootDirectoryPath)
})
