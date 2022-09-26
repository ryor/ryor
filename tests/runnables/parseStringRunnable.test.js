import { parseStringRunnable } from '../../source/runnables/parseStringRunnable'

describe('Parse string runnable', () => {
  test('from empty string', () => expect(parseStringRunnable('')).toEqual([]))

  test('from string with no whitespace', () => expect(parseStringRunnable('command')).toEqual(['command']))

  test('from string with leading and trailing whitespace', () => expect(parseStringRunnable(' command ')).toEqual(['command']))

  test('from string with whitespace', () =>
    expect(parseStringRunnable('command -args value --arg value')).toEqual(['command', '-args', 'value', '--arg', 'value']))

  test('from string with environment variable', () => expect(parseStringRunnable('command $NODE_ENV')).toEqual(['command', 'test']))

  test('from string with glob', () => expect(parseStringRunnable('command ./**.*.js')).toEqual(['command', './**.*.js']))

  test('from string with shell operator (ignored for now)', () =>
    expect(parseStringRunnable('command || command > command')).toEqual(['command', 'command', 'command']))

  test('from string with shell comment', () => expect(parseStringRunnable('command # command')).toEqual(['command']))
})
