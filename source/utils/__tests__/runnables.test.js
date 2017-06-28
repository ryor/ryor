const {resolve} = require('path')
const {Runner} = require('../../Runner')
const {resolveRunnable, runRunnable} = require('../runnables')
const rootDirectoryPath = resolve(__dirname, '../../..')

test('Resolves runnables', () =>
{
  let runnable

  process.chdir(resolve(rootDirectoryPath, `test-projects/only-tasks`))

  runnable = resolveRunnable('build')

  expect(runnable.function).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('build')

  runnable = resolveRunnable('deploy arg1 arg2')

  expect(runnable.function).toBeInstanceOf(Function)
  expect(runnable.args).toEqual(['arg1', 'arg2'])
  expect(runnable.context).toBe('deploy')

  runnable = resolveRunnable('test')

  expect(runnable).toBeInstanceOf(Runner)
  expect(runnable.definitions).toEqual([
    'echo running tests',
    [
      'echo running test 1 in parallel',
      'echo running test 2 in parallel',
      'echo running test 3 in parallel',
      'echo running test 4 in parallel'
    ],
    'echo all tests passed successfully'
  ])

  process.chdir(rootDirectoryPath)
})

test('Runs command runnables', () =>
{
  let promises = []

  promises.push(runRunnable({command:'echo', args:['value']}))
  expect(promises[0]).toBeInstanceOf(Promise)

  promises.push(runRunnable({command:'cd', args:['test-projects']}))
  expect(promises[1]).toBeInstanceOf(Promise)

  return Promise.all(promises).then(results =>
  {
    expect(results[0]).toBeUndefined()
    expect(results[1]).toBeUndefined()
    expect(process.cwd()).toBe(resolve(rootDirectoryPath, 'test-projects'))

    process.chdir(rootDirectoryPath)
  })
})

test('Runs function runnables', () =>
{
  function run1()
  {
    return 'echo value'
  }

  function run2()
  {
    return ['echo value1', 'echo value2']
  }

  function run3(args)
  {
    return `echo ${args.join(' ')}`
  }

  function run4() {}

  let promises = []

  promises.push(runRunnable({function:run1, args:[]}))
  expect(promises[0]).toBeInstanceOf(Promise)

  promises.push(runRunnable({function:run2, args:[]}))
  expect(promises[1]).toBeInstanceOf(Promise)

  promises.push(runRunnable({function:run3, args:[]}))
  expect(promises[2]).toBeInstanceOf(Promise)

  promises.push(runRunnable({function:run3, args:['value1', 'value2']}))
  expect(promises[3]).toBeInstanceOf(Promise)

  promises.push(runRunnable({function:run4, args:[]}))
  expect(promises[4]).toBeInstanceOf(Promise)

  return Promise.all(promises).then(results =>
  {
    expect(results[0]).toBe('echo value')
    expect(results[1]).toEqual(['echo value1', 'echo value2'])
    expect(results[2]).toBe('echo ')
    expect(results[3]).toBe('echo value1 value2')
    expect(results[4]).toBeUndefined()
  })
})
