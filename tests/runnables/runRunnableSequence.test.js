/* eslint-env jest */

import { resolve } from 'path'
import { runRunnableSequence } from '../../source/runnables/runRunnableSequence'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'
import { LINE_BREAK } from '../../source/shared/constants'

describe('Runs runnable sequence', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
  const configuration = { directory: resolve(projectDirectoryPath, 'run') }
  let output = ''

  beforeAll(async () => {
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data + LINE_BREAK})
    process.chdir(projectDirectoryPath)
    await ensureCorrectPATHValue()
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('empty sequence', async () => expect(await runRunnableSequence([])).toBe(undefined))

  test('two shell command runnables', async () => {
    await runRunnableSequence(['echo hello world', 'log hello world'], configuration)
    expect(output.trim()).toBe(`hello world${LINE_BREAK}hello world`)
  })

  test('one shell command runnable and one function runnable', async () => {
    await runRunnableSequence(['echo hello world', () => console.log('hello world'), 'cd ..'], configuration)
    expect(output.trim()).toBe(`hello world${LINE_BREAK}hello world`)
    expect(process.cwd()).toBe(projectsDirectoryPath)
  })

  test('shell command runnables, including cd commands', async () => {
    process.chdir(projectDirectoryPath)
    await runRunnableSequence(['echo hello world', ['cd ..'], () => 'cd all', [async () => console.log('hello world')]], configuration)
    expect(output.trim()).toBe(`hello world${LINE_BREAK}hello world`)
    expect(process.cwd()).toBe(projectDirectoryPath)
  })

  test('concurrent shell command runnables', async () => {
    await runRunnableSequence(['-c', 'echo hello', 'log world'], configuration)
    expect(output.includes('hello')).toBe(true)
  })

  test('concurrent shell command runnable and function runnable', async () => {
    await runRunnableSequence(['--concurrent', 'echo hello', () => console.log('world')], configuration)
    expect(output.includes('hello')).toBe(true)
    expect(output.includes('world')).toBe(true)
  })
})
