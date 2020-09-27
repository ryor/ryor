describe('Runs runnable module', () => {
  const { EOL } = require('os')
  const { resolve } = require('path')
  const { runRunnableModule } = require('../source/runRunnableModule')

  afterAll(() => jest.restoreAllMocks())

  test('with string runnable definition', async () => {
    const expectedOutput = 'Did something.'
    let output = ''

    jest.spyOn(process.stdout, 'write').mockImplementation(data => output += data)

    await runRunnableModule({ run: `echo ${expectedOutput}` }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns string runnable definition', async () => {
    const expectedOutput = 'Did something.'
    let output = ''

    jest.spyOn(process.stdout, 'write').mockImplementation(data => output += data)

    await runRunnableModule({ run: () => `echo ${expectedOutput}` }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => `echo ${expectedOutput}` }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with function that returns function(s)', async () => {
    let output = ''

    jest.spyOn(console, 'log').mockImplementation(data => { output += data })

    await runRunnableModule({ run: () => console.log('1') }, 'runnable')
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: async () => console.log('1') }, 'runnable')
    expect(output.trim()).toBe('1')

    output = ''
    await runRunnableModule({ run: () => { console.log('1'); return () => console.log('2') }}, 'runnable')
    expect(output.trim()).toBe('12')

    output = ''
    await runRunnableModule({ run: async () => { console.log('1'); return async () => console.log('2') }}, 'runnable')
    expect(output.trim()).toBe('12')

    output = ''
    await runRunnableModule({ run: () => { console.log('1'); return () => { console.log('2'); return () => console.log('3') }}}, 'runnable')
    expect(output.trim()).toBe('123')

    output = ''
    await runRunnableModule({ run: async () => { console.log('1'); return async () => { console.log('2'); return async () => console.log('3') }}}, 'runnable')
    expect(output.trim()).toBe('123')
  })

  test('with function that does not return runnable definition', async () => {
    const expectedOutput = 'Did something.'
    let output = ''

    jest.spyOn(console, 'log').mockImplementation(data => { output += data })

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
    let output = ''

    jest.spyOn(process.stdout, 'write').mockImplementation(data => output += data)

    await runRunnableModule({ run: [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    jest.spyOn(console, 'log').mockImplementation(data => { output += data })

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
    let output = ''

    jest.spyOn(process.stdout, 'write').mockImplementation(data => output += data)

    await runRunnableModule({ run: () => [`echo ${firstLine}`, `echo ${secondLine}`] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    jest.spyOn(console, 'log').mockImplementation(data => { output += data })

    output = ''
    await runRunnableModule({ run: () => [`echo ${firstLine}`, () => console.log(secondLine)] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)

    output = ''
    await runRunnableModule({ run: async () => [`echo ${firstLine}`, async () => console.log(secondLine)] }, 'runnable')
    expect(output.trim()).toBe(expectedOutput)
  })

  test('with string runnable definition that uses other module', async () => {
    let output = ''

    process.chdir(resolve(__dirname, 'test-projects/all'))

    jest.spyOn(console, 'log').mockImplementation(data => { output += data })

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
