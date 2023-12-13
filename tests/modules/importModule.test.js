import { resolve } from 'path'
import { importModule } from '../../source/modules/importModule'

describe('Import module(s)', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  afterEach(() => jest.resetModules())

  test('returns undefined when module cannot be resolved', async () => {
    expect(await importModule(resolve(__dirname, 'unresolvable'))).toBeUndefined()
  })

  test('returns undefined when module contains syntax error', async () => {
    expect(await importModule(resolve(projectsDirectoryPath, 'syntax-error/main/bundler'))).toBeUndefined()
  })

  test('in "nested-directories" test project', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'nested-directories/tasks')

    expect(await importModule(resolve(directoryPath, 'tools/bundler.js'))).toBeDefined()
    expect(await importModule(resolve(directoryPath, 'tools/tester'))).toBeDefined()
    expect(await importModule(resolve(directoryPath, 'tools/transpiler'))).toBeDefined()
  })

  test('in "all" test project', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'all/tasks')

    expect(await importModule(resolve(directoryPath, 'git'))).toBeDefined()
    expect(await importModule(resolve(directoryPath, 'main/build'))).toBeDefined()
    expect(await importModule(resolve(directoryPath, 'tools/bundler'))).toBeDefined()
  })
})
