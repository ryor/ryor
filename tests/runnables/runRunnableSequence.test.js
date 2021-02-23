/* eslint-env jest */

import { resolve } from 'path'
import { runRunnableSequence } from '../../source/runnables/runRunnableSequence'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'

describe('Runs runnable sequence', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  let output

  beforeAll(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('with empty sequence', async () => expect(await runRunnableSequence([])).toBe(undefined))

  test('with valid sequence (including nested sequences)', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const configuration = { directory: resolve(projectDirectoryPath, 'run') }

    process.chdir(projectDirectoryPath)
    ensureCorrectPATHValue()

    output = ''
    await runRunnableSequence(['echo hello world', 'log hello world'], configuration)
    expect(output.trim()).toBe('hello world\nhello world')

    output = ''
    await runRunnableSequence(['echo hello world', () => console.log('hello world'), 'cd ..'], configuration)
    expect(output.trim()).toBe('hello world\nhello world')
    expect(process.cwd()).toBe(projectsDirectoryPath)

    output = ''
    process.chdir(projectDirectoryPath)
    await runRunnableSequence(['echo hello world', ['cd ..'], () => 'cd all', [async () => console.log('hello world')]], configuration)
    expect(output.trim()).toBe('hello world\nhello world')
    expect(process.cwd()).toBe(projectDirectoryPath)

    output = ''
    process.chdir(projectDirectoryPath)
    await runRunnableSequence(['echo hello world', ['cd ..', [() => 'cd all', [async () => console.log('hello world')]]]], configuration)
    expect(output.trim()).toBe('hello world\nhello world')
    expect(process.cwd()).toBe(projectDirectoryPath)
  })

  test('with concurrent runnables', async () => {
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const configuration = { directory: resolve(projectDirectoryPath, 'run') }

    process.chdir(resolve(projectDirectoryPath))
    ensureCorrectPATHValue()

    output = ''
    await runRunnableSequence(['-c', 'echo hello', 'log world'], configuration)
    expect(output.includes('hello')).toBe(true)
    expect(output.includes('world')).toBe(true)

    output = ''
    await runRunnableSequence(['--concurrent', 'echo hello', () => console.log('world')], configuration)
    expect(output.includes('hello')).toBe(true)
    expect(output.includes('world')).toBe(true)
  })
})
