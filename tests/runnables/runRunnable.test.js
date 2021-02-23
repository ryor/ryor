/* eslint-env jest */

import { resolve } from 'path'
import { runRunnable } from '../../source/runnables/runRunnable'

describe('Runs runnable', () => {
  let output

  beforeAll(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
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
    const runnable = 'echo some message'

    expect(await runRunnable(runnable, { directory: resolve(process.cwd(), 'run') })).toBe(undefined)
    expect(output.trim()).toBe('some message')
  })
})
