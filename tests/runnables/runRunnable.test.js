import { resolve } from 'path'
import { runRunnable } from '../../source/runnables/runRunnable'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'

describe('Run runnable', () => {
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
  const directory = resolve(projectDirectoryPath, 'tasks')
  // prettier-ignore
  const modules = [
    ['linter', 'invalid'],
    ['build', 'main'],
    ['deploy', 'main'],
    ['test', 'main'],
    ['npm'],
    ['tester', 'tools'],
    ['transpiler', 'tools'],
    ['bundler', 'tools'],
    ['git']
  ]
  const configuration = { directory, modules }
  let output

  beforeAll(async () => {
    jest.spyOn(process.stdout, 'write').mockImplementation((data) => {
      output += data
    })
    jest.spyOn(console, 'log').mockImplementation((data) => {
      output += data
    })
    process.chdir(projectDirectoryPath)
    await ensureCorrectPATHValue()
  })

  beforeEach(() => {
    output = ''
    process.chdir(projectDirectoryPath)
  })

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

    runnable = jest.fn(() => {
      output = 'called'
    })
    expect(await runRunnable(runnable)).toBe(undefined)
    expect(runnable).toHaveBeenCalled()
    expect(output).toBe('called')

    runnable = jest.fn(() => 'result')
    expect(await runRunnable(runnable)).toBe('result')
    expect(runnable).toHaveBeenCalled()

    runnable = jest.fn(async () => {
      output = 'called'
    })
    output = ''
    expect(await runRunnable(runnable)).toBe(undefined)
    expect(runnable).toHaveBeenCalled()
    expect(output).toBe('called')

    runnable = jest.fn(async () => 'result')
    expect(await runRunnable(runnable)).toBe('result')
    expect(runnable).toHaveBeenCalled()
  })

  test('echo', async () => {
    await runRunnable('echo some message', configuration)
    expect(output.trim()).toBe('some message')
  })

  test('cd', async () => {
    await runRunnable('cd', configuration)
    expect(process.cwd()).toBe(projectDirectoryPath)

    await runRunnable('cd ..', configuration)
    expect(process.cwd()).toBe(projectsDirectoryPath)

    await runRunnable('cd all', configuration)
    expect(process.cwd()).toBe(projectDirectoryPath)
  })

  test('wd', async () => {
    await runRunnable('wd', configuration)
    expect(output.trim().endsWith(projectDirectoryPath)).toBe(true)

    output = ''
    await runRunnable('cwd=.. wd', configuration)
    expect(output.trim().endsWith(projectsDirectoryPath)).toBe(true)
  })
})
