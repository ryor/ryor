import { resolve } from 'path'
import { runRunnableModule } from '../../source/modules/runRunnableModule'
import { LINE_BREAK } from '../../source/shared/constants'

describe('Run runnable module', () => {
  const projectDirectoryPath = resolve(__dirname, '../.test-projects/projects/all')
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

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation((data) => {
      output += data + LINE_BREAK
    })
    jest.spyOn(process.stdout, 'write').mockImplementation((data) => {
      output += data
    })
  })

  beforeEach(() => {
    output = ''
  })

  afterAll(() => jest.restoreAllMocks())

  test('with string runnable definition', async () => {
    const expectedOutput = 'Did something.'

    await runRunnableModule({ run: `echo ${expectedOutput}` }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns string runnable definition', async () => {
    const expectedOutput = 'Did something.'

    await runRunnableModule({ run: () => `echo ${expectedOutput}` }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => `echo ${expectedOutput}` }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns function(s)', async () => {
    await runRunnableModule({ run: () => console.log('1') }, 'runnable', [], configuration)
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: async () => console.log('1') }, 'runnable', [], configuration)
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule(
      {
        run: () => {
          console.log('1')
          return () => console.log('2')
        }
      },
      'runnable',
      [],
      configuration
    )
    expect(output.trim()).toBe(`1${LINE_BREAK}2`)

    output = ''
    await runRunnableModule(
      {
        run: async () => {
          console.log('1')
          return async () => console.log('2')
        }
      },
      'runnable',
      [],
      configuration
    )
    expect(output.trim()).toBe(`1${LINE_BREAK}2`)

    output = ''
    await runRunnableModule(
      {
        run: () => {
          console.log('1')
          return () => {
            console.log('2')
            return () => console.log('3')
          }
        }
      },
      'runnable',
      [],
      configuration
    )
    expect(output.trim()).toBe(`1${LINE_BREAK}2${LINE_BREAK}3`)

    output = ''
    await runRunnableModule(
      {
        run: async () => {
          console.log('1')
          return async () => {
            console.log('2')
            return async () => console.log('3')
          }
        }
      },
      'runnable',
      [],
      configuration
    )
    expect(output.trim()).toBe(`1${LINE_BREAK}2${LINE_BREAK}3`)
  })

  test('with function that does not return runnable definition', async () => {
    const expectedOutput = 'Did something.'

    await runRunnableModule({ run: () => console.log(expectedOutput) }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => console.log(expectedOutput) }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with sequence runnables definition', async () => {
    const firstLine = 'Did something.'
    const secondLine = 'Did something else.'
    const expectedOutput = firstLine + LINE_BREAK + secondLine

    await runRunnableModule({ run: [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns sequence runnables definition', async () => {
    const firstLine = 'Did something.'
    const secondLine = 'Did something else.'
    const expectedOutput = firstLine + LINE_BREAK + secondLine

    await runRunnableModule({ run: () => [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: () => [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable', [], configuration)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with string runnable definition that uses other module', async () => {
    process.chdir(projectDirectoryPath)

    await runRunnableModule({ run: 'npm' }, 'runnable', [], configuration)
    expect(output.trim()).toBe('Running NPM command')

    output = ''
    await runRunnableModule({ run: 'git' }, 'runnable', [], configuration)
    expect(output.trim()).toBe('Running Git command')

    output = ''
    await runRunnableModule({ run: 'tester' }, 'runnable', [], configuration)
    expect(output.trim()).toBe('Testing without coverage results')

    output = ''
    await runRunnableModule({ run: 'tester --coverage' }, 'runnable', [], configuration)
    expect(output.trim()).toBe('Testing with coverage results')

    output = ''
    await runRunnableModule({ run: 'transpiler' }, 'runnable', [], configuration)
    expect(output.trim()).toBe('Transpiling')

    output = ''
    await runRunnableModule({ run: 'transpiler -q' }, 'runnable', [], configuration)
    expect(output.trim()).toBe('Transpiling quietly')
  })
})
