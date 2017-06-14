import {resolve} from 'path'
import {getRunnableModules, resolveRequestedRunnables, resolveRunnable, runFunctionRunnable, runProcessRunnable, splitRunnableValues} from '../source/runnables'

const rootDirectoryPath = resolve(__dirname, '..')

test('Gets all runnable modules', () =>
{
  let runnableModules
  let typeModules

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))

  runnableModules = getRunnableModules()

  expect(runnableModules.size).toBe(1)
  expect(runnableModules.has('tasks')).toBe(true)

  typeModules = runnableModules.get('tasks')!

  expect(Array.from(typeModules.keys())).toEqual(['build', 'deploy', 'test'])

  process.chdir(resolve(rootDirectoryPath, `tests/projects/tasks-and-tools`))

  runnableModules = getRunnableModules()

  expect(runnableModules.size).toBe(2)
  expect(runnableModules.has('tasks')).toBe(true)
  expect(runnableModules.has('tools')).toBe(true)

  typeModules = runnableModules.get('tasks')!

  expect(Array.from(typeModules.keys())).toEqual(['build', 'deploy', 'test'])

  typeModules = runnableModules.get('tools')!

  expect(Array.from(typeModules.keys())).toEqual(['bundler', 'tester', 'transpiler'])

  process.chdir(rootDirectoryPath)
})

test('Resolves runnables', () =>
{
  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))

  const runnableModules = getRunnableModules()
  let runnable

  runnable = resolveRunnable('build', runnableModules)

  expect(runnable).toBeDefined()
  expect(typeof runnable).toBe('function')

  runnable = resolveRunnable('test', runnableModules)

  expect(runnable).toBeDefined()
  expect(typeof runnable).toBe('string')

  runnable = resolveRunnable('bundler', runnableModules)

  expect(runnable).toBeUndefined()

  process.chdir(rootDirectoryPath)
})

test('Resolves requested runnable definitions', () =>
{
  let runnableModules
  let definitions

  process.chdir(resolve(rootDirectoryPath, `tests/projects/only-tasks`))

  runnableModules = getRunnableModules()

  definitions = resolveRequestedRunnables(['build'], runnableModules)

  expect(definitions).toEqual([{command: 'echo', args: ['running', 'development', 'build']}])

  definitions = resolveRequestedRunnables(['build', 'production'], runnableModules)

  expect(definitions).toEqual([{command: 'echo', args: ['running', 'production', 'build']}])

  definitions = resolveRequestedRunnables(['test', '+', 'build', 'production'], runnableModules)

  expect(definitions).toEqual([
    {command: 'echo', args: ['testing']},
    {command: 'echo', args: ['running', 'production', 'build']}
  ])

  process.chdir(resolve(rootDirectoryPath, `tests/projects/tasks-and-tools`))

  runnableModules = getRunnableModules()

  definitions = resolveRequestedRunnables(['test'], runnableModules)

  expect(definitions).toEqual([
    {command: 'echo', args: ['testing']},
    {command: 'echo', args: ['testing', 'with', 'coverage', 'results']}
  ])

  definitions = resolveRequestedRunnables(['test', '+', 'build', 'production'], runnableModules)

  expect(definitions).toEqual([
    {command: 'echo', args: ['testing']},
    {command: 'echo', args: ['testing', 'with', 'coverage', 'results']},
    {command: 'echo', args: ['running', 'production', 'build']}
  ])

  process.chdir(rootDirectoryPath)
})

test('Runs function runnables', () =>
{
  function runnableFunction(args)
  {
    if (!args)
      value = 'No args passed'

    else
      value = args.join(' ')
  }

  function runnableFunctionPromise(args)
  {
    return new Promise(resolve =>
    {
      if (args)
        value = args.join(' ')

      resolve()
    })
  }

  let value = ''
  let response

  response = runFunctionRunnable({function:runnableFunction})

  expect(response instanceof Promise).toBe(true)
  expect(value).toBe('No args passed')

  response = runFunctionRunnable({function:runnableFunction, args:['value']})

  expect(response instanceof Promise).toBe(true)
  expect(value).toBe('value')

  response = runFunctionRunnable({function:runnableFunction, args:['value1', 'value2']})

  expect(response instanceof Promise).toBe(true)
  expect(value).toBe('value1 value2')

  response = runFunctionRunnable({function:runnableFunctionPromise, args:['value1', 'value2']})

  expect(response instanceof Promise).toBe(true)
  expect(value).toBe('value1 value2')
})

test('Runs process runnables', () =>
{
  const response = runProcessRunnable({command:'echo', args:['value']})

  expect(response instanceof Promise).toBe(true)
})

test('Splits runnable values', () =>
{
  expect(splitRunnableValues([])).toEqual([])
  expect(splitRunnableValues(['build'])).toEqual([['build']])
  expect(splitRunnableValues(['build', 'value', 'value'])).toEqual([['build', 'value', 'value']])
  expect(splitRunnableValues(['build', '+', 'test'])).toEqual([['build'], ['test']])
  expect(splitRunnableValues(['build', 'value', 'value', '+', 'test', 'value', 'value'])).toEqual([['build', 'value', 'value'], ['test', 'value', 'value']])
})
