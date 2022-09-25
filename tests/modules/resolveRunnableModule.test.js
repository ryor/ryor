import { resolve } from 'path'
import { resolveRunnableModule } from '../../source/modules/resolveRunnableModule'

describe('Resolve runnable module', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('undefined when module cannot be resolved', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('runnable', { directory: resolve(projectDirectoryPath, 'run') })).toBeUndefined()
  })

  test('undefined when module contains syntax error', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('bundler', { directory: resolve(projectDirectoryPath, 'run') })).toBeUndefined()
  })

  test('in "nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'nested-directories')
    let name

    process.chdir(projectDirectoryPath)

    name = 'bundler'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()

    name = 'tester'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()

    name = 'transpiler'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()
  })

  test('in "no-nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'no-nested-directories')
    let name

    process.chdir(projectDirectoryPath)

    name = 'build'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'tasks') })).toBeDefined()

    name = 'deploy'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'tasks') })).toBeDefined()

    name = 'test'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'tasks') })).toBeDefined()
  })

  test('in "all" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    let name

    process.chdir(projectDirectoryPath)

    name = 'git'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()

    name = 'bundler'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()

    name = 'transpiler'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()

    name = 'tester'
    expect(await resolveRunnableModule(name, { directory: resolve(projectDirectoryPath, 'run') })).toBeDefined()
  })
})
