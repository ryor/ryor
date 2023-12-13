import { resolve } from 'path'
import { resolveModulePath } from '../../source/modules/resolveModulePath'

describe('Resolve module path', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('in "no-nested-directories" test project', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'no-nested-directories/tasks')

    expect(await resolveModulePath(directoryPath, 'build')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'deploy')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'test')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'foo')).toBeUndefined()
  })

  test('in "nested-directories" test project', async () => {
    let directoryPath = resolve(projectsDirectoryPath, 'nested-directories/tasks/main')

    expect(await resolveModulePath(directoryPath, 'build')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'foo')).toBeUndefined()

    directoryPath = resolve(projectsDirectoryPath, 'nested-directories/tasks/tools')

    expect(await resolveModulePath(directoryPath, 'bundler')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'tester')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'transpiler')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'foo')).toBeUndefined()

    directoryPath = resolve(projectsDirectoryPath, 'nested-directories/tasks/version-control')

    expect(await resolveModulePath(directoryPath, 'commit')).toBeDefined()
    expect(await resolveModulePath(directoryPath, 'foo')).toBeUndefined()
  })
})
