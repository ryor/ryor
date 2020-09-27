describe('Resolve all runnable modules', () => {
  const { resolve } = require('path')
  const { resolveAllRunnableModules } = require('../source/resolveAllRunnableModules')

  test('in "only-untyped" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-untyped'))

    const modules = await resolveAllRunnableModules()
    const untypedModules = modules.get('untyped')

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(1)
    expect(untypedModules).toBeInstanceOf(Map)
    expect(untypedModules.size).toBe(3)
    expect(untypedModules.get('build')).toBeDefined()
    expect(untypedModules.get('test')).toBeDefined()
    expect(untypedModules.get('deploy')).toBeDefined()
  })

  test('in "only-tools" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/only-tools'))

    const modules = await resolveAllRunnableModules()
    const toolsModules = modules.get('tools')

    expect(modules).toBeInstanceOf(Map)
    expect(modules.size).toBe(1)
    expect(toolsModules).toBeInstanceOf(Map)
    expect(toolsModules.size).toBe(3)
    expect(toolsModules.get('bundler')).toBeDefined()
    expect(toolsModules.get('tester')).toBeDefined()
    expect(toolsModules.get('transpiler')).toBeDefined()
  })

  test('in "all" test project', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))

    const modules = await resolveAllRunnableModules()
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
