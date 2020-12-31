/* eslint-env jest */

import { resolve } from 'path'
import { configure } from '../source/configure'

describe('Creates configuration based on inputs', () => {
  const directoryName = 'run'
  const directoryPath = resolve(process.cwd(), 'run')
  const nodePath = process.argv[0]
  const argvInitial = [nodePath, directoryPath]

  test('with no runnable sequence defined', async () => {
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: ['help'] } }

    expect(await configure([nodePath, resolve(process.cwd(), 'run')])).toEqual(expectedOutput)
    expect(await configure([nodePath, resolve(process.cwd(), 'run/')])).toEqual(expectedOutput)
    expect(await configure([nodePath, resolve(process.cwd(), 'run/index')])).toEqual(expectedOutput)
    expect(await configure([nodePath, resolve(process.cwd(), 'run/index.js')])).toEqual(expectedOutput)
  })

  test('with usage information requested explicitly', async () => {
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: ['help'] } }

    expect(await configure([...argvInitial, 'help'])).toEqual(expectedOutput)

    const runnable = 'test'

    expectedOutput.entry.sequence.push(runnable)

    expect(await configure([...argvInitial, 'help', runnable])).toEqual(expectedOutput)
    expect(await configure([...argvInitial, 'help', runnable, 'arg', 'arg', 'etc'])).toEqual(expectedOutput)
  })

  test('with one runnable with options defined', async () => {
    const arg1 = 'test'
    const arg2 = '-v'
    const arg3 = '--coverage'
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: [`${arg1} ${arg2} ${arg3}`] } }

    expect(await configure([...argvInitial, arg1, arg2, arg3])).toEqual(expectedOutput)
  })

  test('with one runnable with output run duration flag set', async () => {
    const runnable = 'test'
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: [runnable] }, outputRunDuration: true }

    expect(await configure([...argvInitial, '-d', runnable])).toEqual(expectedOutput)
    expect(await configure([...argvInitial, '--duration', runnable])).toEqual(expectedOutput)
    expect(await configure([...argvInitial, '-d', '--duration', runnable])).toEqual(expectedOutput)
    expect(await configure([...argvInitial, '-d', '--duration', '-d', runnable])).toEqual(expectedOutput)
  })

  test('with one runnable with options with quoted plus signs as arguments defined', async () => {
    const arg1 = 'test'
    const arg2 = '-a'
    const arg3 = '"+"'
    const arg4 = '-b'
    const arg5 = "'+'"
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: [`${arg1} ${arg2} ${arg3} ${arg4} ${arg5}`] } }

    expect(await configure([...argvInitial, arg1, arg2, arg3, arg4, arg5])).toEqual(expectedOutput)
  })

  test('with two runnables defined', async () => {
    const arg1 = 'test'
    const arg2 = 'build'
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: [arg1, arg2] } }

    expect(await configure([...argvInitial, arg1, '+', arg2])).toEqual(expectedOutput)
  })

  test('with two runnables with options defined', async () => {
    const arg1 = 'test'
    const arg2 = 'build'
    const arg3 = '-v'
    const arg4 = '--coverage'
    const arg5 = '-q'
    const expectedOutput = { entry: { directoryName, directoryPath, sequence: [`${arg1} ${arg2} ${arg3}`, `${arg4} ${arg5}`] } }

    expect(await configure([...argvInitial, arg1, arg2, arg3, '+', arg4, arg5])).toEqual(expectedOutput)
  })
})
