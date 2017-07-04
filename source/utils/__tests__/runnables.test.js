const {bold} = require('chalk')
const {resolve} = require('path')
const {CommandRunnable} = require('../../classes/CommandRunnable')
const {FunctionRunnable} = require('../../classes/FunctionRunnable')
const {Runner} = require('../../classes/Runner')
const {clear} = require('../modules')
const {resolveRunnable} = require('../runnables')
const rootDirectoryPath = resolve(__dirname, '../../..')

test('Resolves runnables', () =>
{
  let runnable

  clear()

  runnable = resolveRunnable('some-system-executable --arg1 --arg2 value')
  expect(runnable).toBeInstanceOf(CommandRunnable)
  expect(runnable.command).toBe('some-system-executable')
  expect(runnable.args).toEqual(['--arg1', '--arg2', 'value'])

  runnable = resolveRunnable(['some-system-executable', '--arg1', '--arg2', 'value'])
  expect(runnable).toBeInstanceOf(CommandRunnable)
  expect(runnable.command).toBe('some-system-executable')
  expect(runnable.args).toEqual(['--arg1', '--arg2', 'value'])

  process.chdir(resolve(rootDirectoryPath, 'test-projects/only-tasks'))

  clear()

  runnable = resolveRunnable('build')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('build')

  runnable = resolveRunnable(['build'])
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('build')

  runnable = resolveRunnable('deploy arg1 arg2')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual(['arg1', 'arg2'])
  expect(runnable.context).toBe('deploy')

  runnable = resolveRunnable(['deploy', 'arg1', 'arg2'])
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
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

  process.chdir(resolve(rootDirectoryPath, 'test-projects/only-tools'))

  clear()

  runnable = resolveRunnable('bundler')
  expect(runnable).toBeInstanceOf(CommandRunnable)
  expect(runnable.command).toBe('echo')
  expect(runnable.args).toEqual(['bundling'])

  runnable = resolveRunnable('tester')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('tester')

  runnable = resolveRunnable('transpiler')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('transpiler')

  process.chdir(rootDirectoryPath)
})

test('Throws errors when invalid definition values are passed to resolveRunnable function', () =>
{
  expect(() => resolveRunnable()).toThrow(`Invalid definition passed to resolveRunnable function: ${bold('undefined')}`)
  expect(() => resolveRunnable(true)).toThrow(`Invalid definition passed to resolveRunnable function: ${bold('true')}`)
  expect(() => resolveRunnable(1)).toThrow(`Invalid definition passed to resolveRunnable function: ${bold('1')}`)
  expect(() => resolveRunnable({})).toThrow(`Invalid definition passed to resolveRunnable function: ${bold('{}')}`)
  expect(() => resolveRunnable('')).toThrow(`Invalid definition passed to resolveRunnable function: ${bold('empty string')}`)
})

test('Throws error when module contains invalid runnable definition', () =>
{
  clear()

  process.chdir(resolve(rootDirectoryPath, 'test-projects/invalid-definitions'))

  expect(() => resolveRunnable('bundler')).toThrow(`Unexpected runnable definition encountered in ${bold('bundler')} module: ${bold('true')}`)
  expect(() => resolveRunnable('tester')).toThrow(`Unexpected runnable definition encountered in ${bold('tester')} module: ${bold('{}')}`)
  expect(() => resolveRunnable('transpiler')).toThrow(`Unexpected runnable definition encountered in ${bold('transpiler')} module: ${bold('empty string')}`)

  process.chdir(rootDirectoryPath)
})
