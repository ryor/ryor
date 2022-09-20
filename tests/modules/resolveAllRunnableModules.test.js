/* eslint-env jest */

import { resolve } from 'path'
import { resolveAllRunnableModules } from '../../source/modules/resolveAllRunnableModules'

describe('Resolve all runnable modules', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('in "syntax-error" test project, optionally throwing error', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'syntax-error/run')
    const modules = await resolveAllRunnableModules(directoryPath)

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(0)

    try {
      await resolveAllRunnableModules(directoryPath, true)
    } catch (error) {
      expect(error.name).toBe('Error')
    }
  })

  test('in "no-nested-directories" test project', async () => {
    const modules = await resolveAllRunnableModules(resolve(projectsDirectoryPath, 'no-nested-directories/tasks'))
    const untypedModules = modules.get('untyped')

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(1)
    expect(untypedModules).toBeInstanceOf(Map)
    expect(untypedModules.size).toBe(3)
    expect(untypedModules.get('build')).toBeDefined()
    expect(untypedModules.get('test')).toBeDefined()
    expect(untypedModules.get('deploy')).toBeDefined()
  })

  test('in "nested-directories" test project', async () => {
    const allModules = await resolveAllRunnableModules(resolve(projectsDirectoryPath, 'nested-directories/run'))
    let category

    expect(allModules).toBeInstanceOf(Map)
    expect(allModules.size).toBe(3)

    category = allModules.get('tasks')
    expect(category).toBeInstanceOf(Map)
    expect(category.size).toBe(1)
    expect(category.get('build')).toBeDefined()

    category = allModules.get('tools')
    expect(category).toBeInstanceOf(Map)
    expect(category.size).toBe(3)
    expect(category.get('bundler')).toBeDefined()
    expect(category.get('tester')).toBeDefined()
    expect(category.get('transpiler')).toBeDefined()

    category = allModules.get('version-control')
    expect(category).toBeInstanceOf(Map)
    expect(category.size).toBe(1)
    expect(category.get('commit')).toBeDefined()
  })

  test('in "all" test project', async () => {
    const modules = await resolveAllRunnableModules(resolve(projectsDirectoryPath, 'all/run'))
    const tasksModules = modules.get('tasks')
    const toolsModules = modules.get('tools')
    const untypedModules = modules.get('untyped')

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(3)
    expect(toolsModules).toBeInstanceOf(Map)
    expect(tasksModules.size).toBe(3)
    expect(tasksModules.get('build')).toBeDefined()
    expect(tasksModules.get('test')).toBeDefined()
    expect(tasksModules.get('deploy')).toBeDefined()
    expect(toolsModules).toBeInstanceOf(Map)
    expect(toolsModules.size).toBe(3)
    expect(toolsModules.get('bundler')).toBeDefined()
    expect(toolsModules.get('tester')).toBeDefined()
    expect(toolsModules.get('transpiler')).toBeDefined()
    expect(untypedModules.size).toBe(2)
    expect(untypedModules.get('git')).toBeDefined()
    expect(untypedModules.get('npm')).toBeDefined()
  })
})
