/* eslint-env jest */

import { resolve } from 'path'
import { requireModule } from '../../source/modules/requireModule'

describe('Require module(s)', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')

  test('returns undefned or optionally throws error when module cannot be resolved', async () => {
    const modulePath = resolve(__dirname, 'unresolvable')

    expect(requireModule(modulePath)).toBeUndefined()

    jest.resetModules()

    expect(() => requireModule(modulePath, true)).toThrow('Cannot find module')
  })

  test('returns undefned or optionally throws error when module contains syntax error', () => {
    const modulePath = resolve(projectsDirectoryPath, 'syntax-error/run/bundler')

    expect(requireModule(modulePath)).toBeUndefined()

    jest.resetModules()

    expect(() => requireModule(modulePath, true)).toThrow('Unterminated string constant')
  })

  test('in "nested-directories" test project', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'nested-directories/run')

    expect(requireModule(resolve(directoryPath, 'tools/bundler'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tools/tester'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tools/transpiler'))).toBeDefined()
  })

  test('in "all" test project', async () => {
    const directoryPath = resolve(projectsDirectoryPath, 'all/run')

    expect(requireModule(resolve(directoryPath, 'git'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tools/bundler'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tasks/build'))).toBeDefined()
  })
})
