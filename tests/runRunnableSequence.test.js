/* eslint-env jest */

import { resolve } from 'path'
import { ensureCorrectPathValue } from '../source/ensureCorrectPathValue'
import { runRunnableSequence } from '../source/runRunnableSequence'

describe('Runs runnable sequence', () => {
  let output

  beforeAll(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('with empty sequence', async () => expect(await runRunnableSequence([])).toBe(undefined))

  test('with single runnable', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))
    ensureCorrectPathValue()

    await runRunnableSequence('cd ..')
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects'))

    await runRunnableSequence(['cd all'])
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects/all'))

    output = ''
    await runRunnableSequence('echo hello world')
    expect(output.trim()).toBe('hello world')

    output = ''
    await runRunnableSequence(['log hello world'])
    expect(output.trim()).toBe('hello world')

    output = ''
    await runRunnableSequence(() => { console.log('hello world') })
    expect(output).toBe('hello world')

    output = ''
    await runRunnableSequence(async () => { console.log('hello world') })
    expect(output).toBe('hello world')

    output = ''
    await runRunnableSequence(() => new Promise(resolve => { console.log('hello world'); resolve() }))
    expect(output).toBe('hello world')

    output = ''
    await runRunnableSequence('transpiler')
    expect(output).toBe('Transpiling')
  })

  test('with multiple runnables (including nested sequences)', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))
    ensureCorrectPathValue()

    output = ''
    await runRunnableSequence(['echo hello world', 'log hello world'])
    expect(output.trim()).toBe('hello world\nhello world')

    output = ''
    await runRunnableSequence(['echo hello world', () => console.log('hello world'), 'cd ..'])
    expect(output.trim()).toBe('hello world\nhello world')
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects'))

    output = ''
    process.chdir(resolve(__dirname, 'test-projects/all'))
    await runRunnableSequence(['echo hello world', ['cd ..'], () => 'cd all', [async () => console.log('hello world')]])
    expect(output.trim()).toBe('hello world\nhello world')
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects/all'))

    output = ''
    process.chdir(resolve(__dirname, 'test-projects/all'))
    await runRunnableSequence(['echo hello world', ['cd ..', [() => 'cd all', [async () => console.log('hello world')]]]])
    expect(output.trim()).toBe('hello world\nhello world')
    expect(process.cwd()).toBe(resolve(__dirname, 'test-projects/all'))
  })

  test('with multiple runnables concurrently', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))
    ensureCorrectPathValue()

    output = ''
    await runRunnableSequence(['-c', 'echo hello', 'log world'])
    expect(output.includes('hello')).toBe(true)
    expect(output.includes('world')).toBe(true)

    output = ''
    await runRunnableSequence(['--concurrent', 'echo hello', () => console.log('world')])
    expect(output.includes('hello')).toBe(true)
    expect(output.includes('world')).toBe(true)
  })
})
