/* eslint-env jest */
const { bold } = require('chalk')
const { resolve } = require('path')
const { CommandRunnable } = require('../../classes/CommandRunnable')
const { FunctionRunnable } = require('../../classes/FunctionRunnable')
const { Runner } = require('../../classes/Runner')
const { clear } = require('../modules')
const { resolveRunnableFromScript } = require('../runnables')
const rootDirectoryPath = resolve(__dirname, '../../..')

test('Resolves runnables from scripts', () => {
  let runnable

  clear()

  runnable = resolveRunnableFromScript('some-system-executable --arg1 --arg2 value')
  expect(runnable).toBeInstanceOf(CommandRunnable)
  expect(runnable.command).toBe('some-system-executable')
  expect(runnable.args).toEqual(['--arg1', '--arg2', 'value'])

  runnable = resolveRunnableFromScript(['some-system-executable', '--arg1', '--arg2', 'value'])
  expect(runnable).toBeInstanceOf(CommandRunnable)
  expect(runnable.command).toBe('some-system-executable')
  expect(runnable.args).toEqual(['--arg1', '--arg2', 'value'])

  process.chdir(resolve(rootDirectoryPath, 'test-projects/only-tasks'))

  clear()

  runnable = resolveRunnableFromScript('build')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('build')

  runnable = resolveRunnableFromScript(['build'])
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('build')

  runnable = resolveRunnableFromScript('deploy arg1 arg2')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual(['arg1', 'arg2'])
  expect(runnable.context).toBe('deploy')

  runnable = resolveRunnableFromScript(['deploy', 'arg1', 'arg2'])
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual(['arg1', 'arg2'])
  expect(runnable.context).toBe('deploy')

  runnable = resolveRunnableFromScript('test')
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

  runnable = resolveRunnableFromScript('bundler')
  expect(runnable).toBeInstanceOf(CommandRunnable)
  expect(runnable.command).toBe('echo')
  expect(runnable.args).toEqual(['bundling'])

  runnable = resolveRunnableFromScript('tester')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('tester')

  runnable = resolveRunnableFromScript('transpiler')
  expect(runnable).toBeInstanceOf(FunctionRunnable)
  expect(runnable.func).toBeInstanceOf(Function)
  expect(runnable.args).toEqual([])
  expect(runnable.context).toBe('transpiler')

  process.chdir(rootDirectoryPath)
})

test('Throws errors when invalid definition values are passed to resolveRunnableFromScript function', () => {
  expect(() => resolveRunnableFromScript()).toThrow(`Invalid runnable definition: ${bold('undefined')}`)
  expect(() => resolveRunnableFromScript(true)).toThrow(`Invalid runnable definition: ${bold('true')}`)
  expect(() => resolveRunnableFromScript(1)).toThrow(`Invalid runnable definition: ${bold('1')}`)
  expect(() => resolveRunnableFromScript({})).toThrow(`Invalid runnable definition: ${bold('{}')}`)
  expect(() => resolveRunnableFromScript('')).toThrow(`Invalid runnable definition: ${bold('empty string')}`)
})

test('Throws error when module contains invalid runnable definition', () => {
  clear()

  process.chdir(resolve(rootDirectoryPath, 'test-projects/invalid-definitions'))

  expect(() => resolveRunnableFromScript('bundler')).toThrow(`Invalid runnable definition encountered in ${bold('bundler')} module: ${bold('true')}`)
  expect(() => resolveRunnableFromScript('tester')).toThrow(`Invalid runnable definition encountered in ${bold('tester')} module: ${bold('{}')}`)
  expect(() => resolveRunnableFromScript('transpiler')).toThrow(`Invalid runnable definition encountered in ${bold('transpiler')} module: ${bold('empty string')}`)

  process.chdir(rootDirectoryPath)
})
