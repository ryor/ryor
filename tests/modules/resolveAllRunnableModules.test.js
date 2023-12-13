import { resolve } from 'path'
import { resolveAllRunnableModules } from '../../source/modules/resolveAllRunnableModules'

describe('Resolve all runnable modules', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('in "syntax-error" test project, optionally throwing error', async () => {
    const directory = resolve(projectsDirectoryPath, 'syntax-error/tasks')
    const modules = [['bundler']]
    const result = await resolveAllRunnableModules({ directory, modules })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)

    await expect(resolveAllRunnableModules({ directory, options: { debug: true } })).rejects.toThrow()
  })

  test('in "no-nested-directories" test project', async () => {
    const directory = resolve(projectsDirectoryPath, 'no-nested-directories/tasks')
    const modules = [['build'], ['test'], ['deploy']]
    const result = await resolveAllRunnableModules({ directory, modules })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(3)
    expect(result.get('build')).toBeDefined()
    expect(result.get('test')).toBeDefined()
    expect(result.get('deploy')).toBeDefined()
  })

  test('in "nested-directories" test project', async () => {
    const directory = resolve(projectsDirectoryPath, 'nested-directories/tasks')
    // prettier-ignore
    const modules = [
      ['build', 'main'],
      ['bundler', 'tools'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['commit', 'version-control']
    ]
    const result = await resolveAllRunnableModules({ directory, modules })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(5)
    expect(result.get('build')).toBeDefined()
    expect(result.get('bundler')).toBeDefined()
    expect(result.get('tester')).toBeDefined()
    expect(result.get('transpiler')).toBeDefined()
    expect(result.get('commit')).toBeDefined()
  })

  test('in "all" test project', async () => {
    const directory = resolve(projectsDirectoryPath, 'all/tasks')
    // prettier-ignore
    const modules = [
      ['linter', 'invalid'],
      ['build', 'main'],
      ['deploy', 'main'],
      ['test', 'main'],
      ['npm'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['bundler', 'tools'],
      ['git']
    ]
    const result = await resolveAllRunnableModules({ directory, modules })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(8)
    expect(result.get('bundler')).toBeDefined()
    expect(result.get('build')).toBeDefined()
    expect(result.get('deploy')).toBeDefined()
    expect(result.get('git')).toBeDefined()
    expect(result.get('npm')).toBeDefined()
    expect(result.get('test')).toBeDefined()
    expect(result.get('tester')).toBeDefined()
    expect(result.get('transpiler')).toBeDefined()
  })
})
