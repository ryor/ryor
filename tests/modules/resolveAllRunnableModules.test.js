import { resolve } from 'path'
import { resolveAllRunnableModules } from '../../source/modules/resolveAllRunnableModules'

describe('Resolve all runnable modules', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('in "syntax-error" test project, optionally throwing error', async () => {
    const directory = resolve(projectsDirectoryPath, 'syntax-error/tasks')
    const result = await resolveAllRunnableModules({ directory })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)

    await expect(resolveAllRunnableModules({ directory, options: { debug: true } })).rejects.toThrow()
  })

  test('in "no-nested-directories" test project', async () => {
    const directory = resolve(projectsDirectoryPath, 'no-nested-directories/tasks')
    const result = await resolveAllRunnableModules({ directory })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(1)
    expect(result.get('untyped')).toBeInstanceOf(Map)
    expect(result.get('untyped').size).toBe(3)
    expect(result.get('untyped').get('build')).toBeDefined()
    expect(result.get('untyped').get('test')).toBeDefined()
    expect(result.get('untyped').get('deploy')).toBeDefined()
  })

  test('in "no-nested-directories" test project with ignore settings', async () => {
    const directory = resolve(projectsDirectoryPath, 'no-nested-directories/tasks')
    const [result1, result2, result3] = await Promise.all([
      resolveAllRunnableModules({ directory, usage: { ignore: ['./build'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./deploy.js'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./build', './test'] } })
    ])

    expect(result1).toBeInstanceOf(Map)
    expect(result1.size).toBe(1)
    expect(result1.get('untyped')).toBeInstanceOf(Map)
    expect(result1.get('untyped').size).toBe(2)
    expect(result1.get('untyped').get('test')).toBeDefined()
    expect(result1.get('untyped').get('deploy')).toBeDefined()

    expect(result2).toBeInstanceOf(Map)
    expect(result2.size).toBe(1)
    expect(result2.get('untyped')).toBeInstanceOf(Map)
    expect(result2.get('untyped').size).toBe(2)
    expect(result2.get('untyped').get('build')).toBeDefined()
    expect(result2.get('untyped').get('test')).toBeDefined()

    expect(result3).toBeInstanceOf(Map)
    expect(result3.size).toBe(1)
    expect(result3.get('untyped')).toBeInstanceOf(Map)
    expect(result3.get('untyped').size).toBe(1)
    expect(result3.get('untyped').get('deploy')).toBeDefined()
  })

  test('in "nested-directories" test project', async () => {
    const directory = resolve(projectsDirectoryPath, 'nested-directories/tasks')
    const result = await resolveAllRunnableModules({ directory })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(3)
    expect(result.get('main')).toBeInstanceOf(Map)
    expect(result.get('main').size).toBe(1)
    expect(result.get('main').get('build')).toBeDefined()
    expect(result.get('tools')).toBeInstanceOf(Map)
    expect(result.get('tools').size).toBe(3)
    expect(result.get('tools').get('bundler')).toBeDefined()
    expect(result.get('tools').get('tester')).toBeDefined()
    expect(result.get('tools').get('transpiler')).toBeDefined()
    expect(result.get('version-control')).toBeInstanceOf(Map)
    expect(result.get('version-control').size).toBe(1)
    expect(result.get('version-control').get('commit')).toBeDefined()
  })

  test('in "nested-directories" test project with ignore settings', async () => {
    const directory = resolve(projectsDirectoryPath, 'nested-directories/tasks')
    const [result1, result2, result3, result4] = await Promise.all([
      resolveAllRunnableModules({ directory, usage: { ignore: ['./main'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./tools'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./tools/tester.js'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./version-control'] } })
    ])

    expect(result1).toBeInstanceOf(Map)
    expect(result1.size).toBe(2)
    expect(result1.get('tools')).toBeInstanceOf(Map)
    expect(result1.get('tools').size).toBe(3)
    expect(result1.get('tools').get('bundler')).toBeDefined()
    expect(result1.get('tools').get('tester')).toBeDefined()
    expect(result1.get('tools').get('transpiler')).toBeDefined()
    expect(result1.get('version-control')).toBeInstanceOf(Map)
    expect(result1.get('version-control').size).toBe(1)
    expect(result1.get('version-control').get('commit')).toBeDefined()

    expect(result2).toBeInstanceOf(Map)
    expect(result2.size).toBe(2)
    expect(result2.get('main')).toBeInstanceOf(Map)
    expect(result2.get('main').size).toBe(1)
    expect(result2.get('main').get('build')).toBeDefined()
    expect(result2.get('version-control')).toBeInstanceOf(Map)
    expect(result2.get('version-control').size).toBe(1)
    expect(result2.get('version-control').get('commit')).toBeDefined()

    expect(result3).toBeInstanceOf(Map)
    expect(result3.size).toBe(3)
    expect(result3.get('main')).toBeInstanceOf(Map)
    expect(result3.get('main').size).toBe(1)
    expect(result3.get('main').get('build')).toBeDefined()
    expect(result3.get('tools')).toBeInstanceOf(Map)
    expect(result3.get('tools').size).toBe(2)
    expect(result3.get('tools').get('bundler')).toBeDefined()
    expect(result3.get('tools').get('transpiler')).toBeDefined()
    expect(result3.get('version-control')).toBeInstanceOf(Map)
    expect(result3.get('version-control').size).toBe(1)
    expect(result3.get('version-control').get('commit')).toBeDefined()

    expect(result4).toBeInstanceOf(Map)
    expect(result4.size).toBe(2)
    expect(result2.get('main')).toBeInstanceOf(Map)
    expect(result2.get('main').size).toBe(1)
    expect(result2.get('main').get('build')).toBeDefined()
    expect(result4.get('tools')).toBeInstanceOf(Map)
    expect(result4.get('tools').size).toBe(3)
    expect(result4.get('tools').get('bundler')).toBeDefined()
    expect(result4.get('tools').get('tester')).toBeDefined()
    expect(result4.get('tools').get('transpiler')).toBeDefined()
  })

  test('in "all" test project', async () => {
    const directory = resolve(projectsDirectoryPath, 'all/tasks')
    const result = await resolveAllRunnableModules({ directory })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(3)
    expect(result.get('main').size).toBe(3)
    expect(result.get('main').get('build')).toBeDefined()
    expect(result.get('main').get('test')).toBeDefined()
    expect(result.get('main').get('deploy')).toBeDefined()
    expect(result.get('tools')).toBeInstanceOf(Map)
    expect(result.get('tools').size).toBe(3)
    expect(result.get('tools').get('bundler')).toBeDefined()
    expect(result.get('tools').get('tester')).toBeDefined()
    expect(result.get('tools').get('transpiler')).toBeDefined()
    expect(result.get('untyped').size).toBe(2)
    expect(result.get('untyped').get('git')).toBeDefined()
    expect(result.get('untyped').get('npm')).toBeDefined()
  })

  test('in "all" test project with ignore settings', async () => {
    const directory = resolve(projectsDirectoryPath, 'all/tasks')
    const [result1, result2, result3, result4] = await Promise.all([
      resolveAllRunnableModules({ directory, usage: { ignore: ['./main'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./tools/tester'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./tools/bundler.js', './tools/tester'] } }),
      resolveAllRunnableModules({ directory, usage: { ignore: ['./git.js'] } })
    ])

    expect(result1).toBeInstanceOf(Map)
    expect(result1.size).toBe(2)
    expect(result1.get('tools')).toBeInstanceOf(Map)
    expect(result1.get('tools').size).toBe(3)
    expect(result1.get('tools').get('bundler')).toBeDefined()
    expect(result1.get('tools').get('tester')).toBeDefined()
    expect(result1.get('tools').get('transpiler')).toBeDefined()
    expect(result1.get('untyped').size).toBe(2)
    expect(result1.get('untyped').get('git')).toBeDefined()
    expect(result1.get('untyped').get('npm')).toBeDefined()

    expect(result2).toBeInstanceOf(Map)
    expect(result2.size).toBe(3)
    expect(result2.get('main').size).toBe(3)
    expect(result2.get('main').get('build')).toBeDefined()
    expect(result2.get('main').get('test')).toBeDefined()
    expect(result2.get('main').get('deploy')).toBeDefined()
    expect(result2.get('tools')).toBeInstanceOf(Map)
    expect(result2.get('tools').size).toBe(2)
    expect(result2.get('tools').get('bundler')).toBeDefined()
    expect(result2.get('tools').get('transpiler')).toBeDefined()
    expect(result2.get('untyped').size).toBe(2)
    expect(result2.get('untyped').get('git')).toBeDefined()
    expect(result2.get('untyped').get('npm')).toBeDefined()

    expect(result3).toBeInstanceOf(Map)
    expect(result3.size).toBe(3)
    expect(result3.get('main').size).toBe(3)
    expect(result3.get('main').get('build')).toBeDefined()
    expect(result3.get('main').get('test')).toBeDefined()
    expect(result3.get('main').get('deploy')).toBeDefined()
    expect(result3.get('tools')).toBeInstanceOf(Map)
    expect(result3.get('tools').size).toBe(1)
    expect(result3.get('tools').get('transpiler')).toBeDefined()
    expect(result3.get('untyped').size).toBe(2)
    expect(result3.get('untyped').get('git')).toBeDefined()
    expect(result3.get('untyped').get('npm')).toBeDefined()

    expect(result4).toBeInstanceOf(Map)
    expect(result4.size).toBe(3)
    expect(result4.get('main').size).toBe(3)
    expect(result4.get('main').get('build')).toBeDefined()
    expect(result4.get('main').get('test')).toBeDefined()
    expect(result4.get('main').get('deploy')).toBeDefined()
    expect(result4.get('tools')).toBeInstanceOf(Map)
    expect(result4.get('tools').size).toBe(3)
    expect(result4.get('tools').get('bundler')).toBeDefined()
    expect(result4.get('tools').get('tester')).toBeDefined()
    expect(result4.get('tools').get('transpiler')).toBeDefined()
    expect(result4.get('untyped').size).toBe(1)
    expect(result4.get('untyped').get('npm')).toBeDefined()
  })
})
