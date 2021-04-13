/* eslint-env jest */

import { parseConsoleInput } from '../../source/console/parseConsoleInput'

describe('Parses console input', () => {
  test('with no arguments', () => {
    expect(parseConsoleInput([])).toEqual({ options: {}, sequence: ['help'] })
  })

  test('with usage information requested explicitly', () => {
    expect(parseConsoleInput(['help'])).toEqual({ options: {}, sequence: ['help'] })
    expect(parseConsoleInput(['help', 'runnable'])).toEqual({ options: {}, sequence: ['help runnable'] })
  })

  test('with invalid flags set', () => {
    expect(parseConsoleInput(['-f', 'runnable'])).toEqual({ options: {}, sequence: ['runnable'] })
    expect(parseConsoleInput(['--foo', 'runnable'])).toEqual({ options: {}, sequence: ['runnable'] })
    expect(parseConsoleInput(['-f', '--boo', 'runnable'])).toEqual({ options: {}, sequence: ['runnable'] })
    expect(parseConsoleInput(['-fb', '--doo', 'runnable'])).toEqual({ options: {}, sequence: ['runnable'] })
  })

  test('with valid flags set', () => {
    expect(parseConsoleInput(['-d', 'runnable'])).toEqual({ options: { debug: true }, sequence: ['runnable'] })
    expect(parseConsoleInput(['--debug', 'runnable'])).toEqual({ options: { debug: true }, sequence: ['runnable'] })
    expect(parseConsoleInput(['-t','runnable'])).toEqual({ options: { time: true }, sequence: ['runnable'] })
    expect(parseConsoleInput(['--time', 'runnable'])).toEqual({ options: { time: true }, sequence: ['runnable'] })
    expect(parseConsoleInput(['-dt','runnable'])).toEqual({ options: { debug: true, time: true }, sequence: ['runnable'] })
    expect(parseConsoleInput(['--debug', '--time', 'runnable'])).toEqual({ options: { debug: true, time: true }, sequence: ['runnable'] })
  })
})
