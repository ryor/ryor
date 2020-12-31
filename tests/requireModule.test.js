/* eslint-env jest */

import { resolve } from 'path'
import { requireModule } from '../source/requireModule'

describe('Require module(s)', () => {
  test('returns undefned or optionally throws error when module cannot be resolved', async () => {
    const modulePath = resolve(__dirname, 'unresolvable')

    expect(requireModule(modulePath)).toBeUndefined()

    jest.resetModules()

    expect(() => requireModule(modulePath, false)).toThrow('Cannot find module')
  })

  test('returns undefned or optionally throws error when module contains syntax error', () => {
    const modulePath = resolve(__dirname, 'test-projects/syntax-error/run/bundler')

    expect(requireModule(modulePath)).toBeUndefined()

    jest.resetModules()

    expect(() => requireModule(modulePath, false)).toThrow('Unterminated string constant')
  })

  test('in "only-tools" test project', async () => {
    const directoryPath = resolve(__dirname, 'test-projects/only-tools/run')

    expect(requireModule(resolve(directoryPath, 'tools/bundler'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tools/tester'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tools/transpiler'))).toBeDefined()
  })

  test('in "all" test project', async () => {
    const directoryPath = resolve(__dirname, 'test-projects/all/run')

    expect(requireModule(resolve(directoryPath, 'git'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tools/bundler'))).toBeDefined()
    expect(requireModule(resolve(directoryPath, 'tasks/build'))).toBeDefined()
  })
})
