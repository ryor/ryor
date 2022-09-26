import { parseRunnerRunnableSequence } from '../../source/runner/parseRunnerRunnableSequence'

describe('Parses command line input', () => {
  test('with no runnable sequence defined', () => {
    expect(parseRunnerRunnableSequence([])).toEqual([])
  })

  test('with usage information requested explicitly', () => {
    expect(parseRunnerRunnableSequence(['help'])).toEqual(['help'])
    expect(parseRunnerRunnableSequence(['help', 'runnable'])).toEqual(['help runnable'])
  })

  test('with one runnable with options defined', () => {
    const arg1 = 'test'
    const arg2 = '-t'
    const arg3 = '--debug'
    const arg4 = '--coverage'

    expect(parseRunnerRunnableSequence([arg1, arg2, arg3, arg4])).toEqual([`${arg1} ${arg2} ${arg3} ${arg4}`])
  })

  test('with one runnable with options with quoted plus signs as arguments defined', async () => {
    const arg1 = 'test'
    const arg2 = '-a'
    const arg3 = '"+"'
    const arg4 = '-b'
    const arg5 = "'+'"

    expect(parseRunnerRunnableSequence([arg1, arg2, arg3, arg4, arg5])).toEqual([`${arg1} ${arg2} ${arg3} ${arg4} ${arg5}`])
  })

  test('with two runnables defined', async () => {
    const arg1 = 'test'
    const arg2 = 'build'

    expect(parseRunnerRunnableSequence([arg1, '+', arg2])).toEqual([arg1, arg2])
  })

  test('with two runnables with options defined', async () => {
    const arg1 = 'test'
    const arg2 = '-t'
    const arg3 = 'build'
    const arg4 = '--coverage'
    const arg5 = '--debug'

    expect(parseRunnerRunnableSequence([arg1, arg2, arg3, '+', arg4, arg5])).toEqual([`${arg1} ${arg2} ${arg3}`, `${arg4} ${arg5}`])
  })
})
