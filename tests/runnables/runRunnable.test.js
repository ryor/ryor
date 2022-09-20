/* eslint-env jest */

import { resolve } from 'path'
import { runRunnable } from '../../source/runnables/runRunnable'

describe('Runs runnable', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
  const configuration = { directory: resolve(projectDirectoryPath, 'run') }
  let output

  beforeAll(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
    process.chdir(projectDirectoryPath)
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('ignores invalid runnables', async () => {
    expect(await runRunnable()).toBe(undefined)
    expect(await runRunnable(null)).toBe(undefined)
    expect(await runRunnable(1)).toBe(undefined)
    expect(await runRunnable(true)).toBe(undefined)
    expect(await runRunnable([])).toBe(undefined)
    expect(await runRunnable('')).toBe(undefined)
  })

  test('with function runnables', async () => {
    let runnable

    runnable = jest.fn(() => { output = 'called' })
    expect(await runRunnable(runnable)).toBe(undefined)
    expect(runnable).toHaveBeenCalled()
    expect(output).toBe('called')

    runnable = jest.fn(() => 'result')
    expect(await runRunnable(runnable)).toBe('result')
    expect(runnable).toHaveBeenCalled()

    runnable = jest.fn(async () => { output = 'called' })
    output = ''
    expect(await runRunnable(runnable)).toBe(undefined)
    expect(runnable).toHaveBeenCalled()
    expect(output).toBe('called')

    runnable = jest.fn(async () => 'result')
    expect(await runRunnable(runnable)).toBe('result')
    expect(runnable).toHaveBeenCalled()
  })

  test('with string runnables', async () => {
    const pwdCommand = process.platform === 'win32' ? 'cd' : 'pwd'

    await runRunnable('echo some message', configuration)
    expect(output.trim()).toBe('some message')

    await runRunnable('cd', configuration)
    expect(process.cwd()).toBe(projectDirectoryPath)

    await runRunnable('cd ..', configuration)
    expect(process.cwd()).toBe(projectsDirectoryPath)

    await runRunnable('cd all', configuration)
    expect(process.cwd()).toBe(projectDirectoryPath)

    output = ''
    await runRunnable(pwdCommand, configuration)
    expect(output.trim()).toBe(projectDirectoryPath)

    output = ''
    await runRunnable(`cwd=.. ${pwdCommand}`, configuration)
    expect(output.trim()).toBe(projectsDirectoryPath)
  })
})
