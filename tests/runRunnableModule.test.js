/* eslint-env jest */

import { EOL } from 'os'
import { resolve } from 'path'
import { runRunnableModule } from '../source/runRunnableModule'

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

    await runRunnableModule({ run: `echo ${expectedOutput}` }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns string runnable definition', async () => {
    const expectedOutput = 'Did something.'

    await runRunnableModule({ run: () => `echo ${expectedOutput}` }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => `echo ${expectedOutput}` }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns function(s)', async () => {
    await runRunnableModule({ run: () => console.log('1') }, 'runnable')
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: async () => console.log('1') }, 'runnable')
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: () => { console.log('1'); return () => console.log('2') } }, 'runnable')
    expect(output.trim()).toBe('12')

    output = ''
    await runRunnableModule({ run: async () => { console.log('1'); return async () => console.log('2') } }, 'runnable')
    expect(output.trim()).toBe('12')

    output = ''
    await runRunnableModule({ run: () => { console.log('1'); return () => { console.log('2'); return () => console.log('3') } } }, 'runnable')
    expect(output.trim()).toBe('123')

    output = ''
    await runRunnableModule({ run: async () => { console.log('1'); return async () => { console.log('2'); return async () => console.log('3') } } }, 'runnable')
    expect(output.trim()).toBe('123')
  })

  test('with function that does not return runnable definition', async () => {
    const expectedOutput = 'Did something.'

    await runRunnableModule({ run: () => console.log(expectedOutput) }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => console.log(expectedOutput) }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with sequence runnables definition', async () => {
    const firstLine = 'Did something.'
    const secondLine = 'Did something else.'
    const expectedOutput = firstLine + EOL + secondLine

    await runRunnableModule({ run: [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns sequence runnables definition', async () => {
    const firstLine = 'Did something.'
    const secondLine = 'Did something else.'
    const expectedOutput = firstLine + EOL + secondLine

    await runRunnableModule({ run: () => [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: () => [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with string runnable definition that uses other module', async () => {
    process.chdir(resolve(__dirname, 'test-projects/all'))

    await runRunnableModule({ run: 'npm' }, 'runnable')
    expect(output.trim()).toBe('Running NPM command')

    output = ''
    await runRunnableModule({ run: 'git' }, 'runnable')
    expect(output.trim()).toBe('Running Git command')

    output = ''
    await runRunnableModule({ run: 'tester' }, 'runnable')
    expect(output.trim()).toBe('Testing without coverage results')

    output = ''
    await runRunnableModule({ run: 'tester coverage' }, 'runnable')
    expect(output.trim()).toBe('Testing with coverage results')
  })
})
