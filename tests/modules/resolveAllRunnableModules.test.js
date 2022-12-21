import { resolve } from 'path'
import { resolveAllRunnableModules } from '../../source/modules/resolveAllRunnableModules'

describe('Resolve all runnable modules', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('in "syntax-error" test project, optionally throwing error', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'syntax-error/tasks')
    const modules = await resolveAllRunnableModules(directoryPath)

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(0)
    await expect(resolveAllRunnableModules(directoryPath, true)).rejects.toThrow()
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
    const allModules = await resolveAllRunnableModules(resolve(projectsDirectoryPath, 'nested-directories/tasks'))
    let category

    expect(allModules).toBeInstanceOf(Map)
    expect(allModules.size).toBe(3)

    category = allModules.get('main')
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
    const modules = await resolveAllRunnableModules(resolve(projectsDirectoryPath, 'all/tasks'))
    const mainModules = modules.get('main')
    const toolsModules = modules.get('tools')
    const untypedModules = modules.get('untyped')

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(3)
    expect(toolsModules).toBeInstanceOf(Map)
    expect(mainModules.size).toBe(3)
    expect(mainModules.get('build')).toBeDefined()
    expect(mainModules.get('test')).toBeDefined()
    expect(mainModules.get('deploy')).toBeDefined()
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
