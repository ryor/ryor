import { parseRunnerOptions } from '../../source/runner/parseRunnerOptions'

describe('Parses runner options', () => {
  test('with invalid flags set', () => {
    expect(parseRunnerOptions(['-f', 'runnable'])).toEqual({})
    expect(parseRunnerOptions(['--foo', 'runnable'])).toEqual({})
    expect(parseRunnerOptions(['-f', '--boo', 'runnable'])).toEqual({})
    expect(parseRunnerOptions(['-fb', '--doo', 'runnable'])).toEqual({})
  })

  test('with valid flags set', () => {
    expect(parseRunnerOptions(['-d', 'runnable'])).toEqual({ debug: true })
    expect(parseRunnerOptions(['--debug', 'runnable'])).toEqual({ debug: true })
    expect(parseRunnerOptions(['-d', '--debug', 'runnable'])).toEqual({ debug: true })
    expect(parseRunnerOptions(['-t', 'runnable'])).toEqual({ time: true })
    expect(parseRunnerOptions(['--time', 'runnable'])).toEqual({ time: true })
    expect(parseRunnerOptions(['-t', '--time', 'runnable'])).toEqual({ time: true })
    expect(parseRunnerOptions(['--debug', '--time', 'runnable'])).toEqual({ debug: true, time: true })
    expect(parseRunnerOptions(['-d', '-t', 'runnable'])).toEqual({ debug: true, time: true })
    expect(parseRunnerOptions(['-dt', 'runnable'])).toEqual({ debug: true, time: true })
  })
})
