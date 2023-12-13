import { resolve } from 'path'
import { resolveRunnableModule } from '../../source/modules/resolveRunnableModule'

describe('Resolve runnable module', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('undefined when module cannot be resolved', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')
    const directory = resolve(projectDirectoryPath, 'tasks')
    const modules = []
    const configuration = { directory, modules }

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('runnable', configuration)).toBeUndefined()
  })

  test('undefined when module contains syntax error', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'syntax-error')
    const directory = resolve(projectDirectoryPath, 'tasks')
    const modules = ['bundler']
    const configuration = { directory, modules }

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('bundler', configuration)).toBeUndefined()
  })

  test('in "nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'nested-directories')
    const directory = resolve(projectDirectoryPath, 'tasks')
    // prettier-ignore
    const modules = [
      ['build', 'main'],
      ['bundler', 'tools'],
      ['tester', 'tools'],
      ['transpiler', 'tools'],
      ['commit', 'version-control']
    ]
    const configuration = { directory, modules }

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('bundler', configuration)).toBeDefined()
    expect(await resolveRunnableModule('tester', configuration)).toBeDefined()
    expect(await resolveRunnableModule('transpiler', configuration)).toBeDefined()
  })

  test('in "no-nested-directories" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'no-nested-directories')
    const directory = resolve(projectDirectoryPath, 'tasks')
    const modules = [['build'], ['test'], ['deploy']]
    const configuration = { directory, modules }

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('build', configuration)).toBeDefined()
    expect(await resolveRunnableModule('deploy', configuration)).toBeDefined()
    expect(await resolveRunnableModule('test', configuration)).toBeDefined()
  })

  test('in "all" test project', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const directory = resolve(projectDirectoryPath, 'tasks')
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
    const configuration = { directory, modules }

    process.chdir(projectDirectoryPath)

    expect(await resolveRunnableModule('git', configuration)).toBeDefined()
    expect(await resolveRunnableModule('bundler', configuration)).toBeDefined()
    expect(await resolveRunnableModule('transpiler', configuration)).toBeDefined()
    expect(await resolveRunnableModule('tester', configuration)).toBeDefined()
  })
})
