/* eslint-env jest */

import { parseCommandLineInput } from '../source/parseCommandLineInput'

describe('Parses command line input into runnable sequence', () => {
  test('with one runnable defined', () => {
    const arg1 = 'build'

    expect(parseCommandLineInput([arg1])).toEqual([arg1])
  })

  test('with one runnable and options defined', () => {
    const arg1 = 'test'
    const arg2 = '-v'
    const arg3 = '--coverage'

    expect(parseCommandLineInput([arg1, arg2, arg3])).toEqual([`${arg1} ${arg2} ${arg3}`])
  })

  test('with one runnable and options with quoted plus signs as arguments defined', () => {
    const arg1 = 'test'
    const arg2 = '-a'
    const arg3 = '"+"'
    const arg4 = '-b'
    const arg5 = "'+'"

    expect(parseCommandLineInput([arg1, arg2, arg3, arg4, arg5])).toEqual([`${arg1} ${arg2} ${arg3} ${arg4} ${arg5}`])
  })

  test('with two runnables defined', () => {
    const arg1 = 'test'
    const arg2 = 'build'

    expect(parseCommandLineInput([arg1, '+', arg2])).toEqual([arg1, arg2])
  })

  test('with two runnables and options defined', () => {
    const arg1 = 'test'
    const arg2 = 'build'
    const arg3 = '-v'
    const arg4 = '--coverage'
    const arg5 = '-q'

    expect(parseCommandLineInput([arg1, arg2, arg3, '+', arg4, arg5])).toEqual([`${arg1} ${arg2} ${arg3}`, `${arg4} ${arg5}`])
  })
})
