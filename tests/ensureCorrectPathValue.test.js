/* eslint-env jest */

import { resolve } from 'path'
import { DEFAULT_DIVIDER, WINDOWS_DIVIDER, WINDOWS_IDENTIFIER, ensureCorrectPathValue } from '../source/ensureCorrectPathValue'

describe('Confirm constant values:', () => {
  test('DEFAULT_DIVIDER', () => expect(DEFAULT_DIVIDER).toBe(':'))
  test('WINDOWS_DIVIDER', () => expect(WINDOWS_DIVIDER).toBe(';'))
  test('WINDOWS_IDENTIFIER', () => expect(WINDOWS_IDENTIFIER).toBe('win32'))
})

describe('Ensures PATH environment variable has correct value', () => {
  const { env } = process
  const PATH = env.PATH
  let binDirectoryPath, projectDirectoryPath

  afterEach(() => { env.PATH = PATH })

  test('does not include node_modules/.bin directory when none exists', () => {
    projectDirectoryPath = resolve(__dirname, 'test-projects/empty')
    binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
    process.chdir(projectDirectoryPath)
    ensureCorrectPathValue()
    expect(env.PATH.includes(binDirectoryPath)).toBe(false)
  })

  test('includes node_modules/.bin directory when it exists', () => {
    projectDirectoryPath = resolve(__dirname, 'test-projects/all')
    binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
    process.chdir(projectDirectoryPath)
    ensureCorrectPathValue()
    expect(env.PATH.includes(binDirectoryPath)).toBe(true)
  })

  test('handles platform divider character properly', () => {
    const platform = process.platform

    projectDirectoryPath = resolve(__dirname, 'test-projects/all')
    binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
    process.chdir(projectDirectoryPath)

    Object.defineProperty(process, 'platform', { value: WINDOWS_IDENTIFIER })
    ensureCorrectPathValue()
    expect(env.PATH.includes(WINDOWS_DIVIDER + binDirectoryPath)).toBe(true)

    env.PATH = PATH
    Object.defineProperty(process, 'platform', { value: 'linux' })
    ensureCorrectPathValue()
    expect(env.PATH.includes(DEFAULT_DIVIDER + binDirectoryPath)).toBe(true)

    Object.defineProperty(process, 'platform', { value: platform })
  })
})
