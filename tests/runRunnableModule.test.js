/* eslint-env jest */

import { resolve } from 'path'
import { runRunnableModule } from '../source/runRunnableModule'

// TEMP / TODO: Figure out correct EOL string for Windows
// import { EOL } from 'os'
const EOL = '\n'

describe('Runs runnable module', () => {
  let output

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(data => { output += data })
    jest.spyOn(process.stdout, 'write').mockImplementation(data => { output += data })
  })

  beforeEach(() => { output = '' })

  afterAll(() => jest.restoreAllMocks())

  test('with string runnable definition', async () => {
    const expectedOutput = 'Did something.'
    const runnablesDirectoryPath = resolve(process.cwd(), 'run')

    await runRunnableModule({ run: `echo ${expectedOutput}` }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns string runnable definition', async () => {
    const expectedOutput = 'Did something.'
    const runnablesDirectoryPath = resolve(process.cwd(), 'run')

    await runRunnableModule({ run: () => `echo ${expectedOutput}` }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => `echo ${expectedOutput}` }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns function(s)', async () => {
    const runnablesDirectoryPath = resolve(process.cwd(), 'run')

    await runRunnableModule({ run: () => console.log('1') }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: async () => console.log('1') }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: () => { console.log('1'); return () => console.log('2') } }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('12')

    output = ''
    await runRunnableModule({ run: async () => { console.log('1'); return async () => console.log('2') } }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('12')

    output = ''
    await runRunnableModule({ run: () => { console.log('1'); return () => { console.log('2'); return () => console.log('3') } } }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('123')

    output = ''
    await runRunnableModule({ run: async () => { console.log('1'); return async () => { console.log('2'); return async () => console.log('3') } } }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('123')
  })

  test('with function that does not return runnable definition', async () => {
    const expectedOutput = 'Did something.'
    const runnablesDirectoryPath = resolve(process.cwd(), 'run')

    await runRunnableModule({ run: () => console.log(expectedOutput) }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => console.log(expectedOutput) }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with sequence runnables definition', async () => {
    const firstLine = 'Did something.'
    const secondLine = 'Did something else.'
    const expectedOutput = firstLine + EOL + secondLine
    const runnablesDirectoryPath = resolve(process.cwd(), 'run')

    await runRunnableModule({ run: [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns sequence runnables definition', async () => {
    const firstLine = 'Did something.'
    const secondLine = 'Did something else.'
    const expectedOutput = firstLine + EOL + secondLine
    const runnablesDirectoryPath = resolve(process.cwd(), 'run')

    await runRunnableModule({ run: () => [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: () => [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with string runnable definition that uses other module', async () => {
    const projectsDirectoryPath = resolve(__dirname, 'test-projects')
    const projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    const runnablesDirectoryPath = resolve(projectDirectoryPath, 'run')

    process.chdir(projectDirectoryPath)

    await runRunnableModule({ run: 'npm' }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('Running NPM command')

    output = ''
    await runRunnableModule({ run: 'git' }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('Running Git command')

    output = ''
    await runRunnableModule({ run: 'tester' }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('Testing without coverage results')

    output = ''
    await runRunnableModule({ run: 'tester --coverage' }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('Testing with coverage results')

    output = ''
    await runRunnableModule({ run: 'transpiler' }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('Transpiling')

    output = ''
    await runRunnableModule({ run: 'transpiler -q' }, 'runnable', [], runnablesDirectoryPath)
    expect(output.trim()).toBe('Transpiling quietly')
  })
})
