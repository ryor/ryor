/* eslint-env jest */

import { parseRunnableArguments } from '../source/parseRunnableArguments'

describe('Parses runnable arguments based on definitions', () => {
  test('with no argument definitions', () => {
    const definitions = {}

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ arg: 'file', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ arg: 50, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ arg: 50, _: ['file'] })
  })

  test('with one untyped argument definition', () => {
    const definitions = { arg: {} }

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ arg: 'file', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ arg: 50, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ arg: 50, _: ['file'] })
  })

  test('with one boolean argument definition', () => {
    const definitions = { arg: { type: 'boolean' } }

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ arg: false, _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: true, arg: false, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ arg: true, _: ['file'] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ arg: true, _: [50] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ arg: true, _: [50, 'file'] })
  })

  test('with one string argument definition', () => {
    const definitions = { arg: { type: 'string' } }

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ arg: '', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ arg: 'file', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ arg: '50', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ arg: '50', _: ['file'] })
  })

  test('with one untyped argument definition with alias', () => {
    const definitions = { arg: { alias: 'a' } }

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: true, arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ a: true, arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ a: 'file', arg: 'file', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ a: 50, arg: 50, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ a: 50, arg: 50, _: ['file'] })
  })

  test('with one boolean argument definition with alias', () => {
    const definitions = { arg: { alias: 'a', type: 'boolean' } }

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ a: false, arg: false, _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: true, arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ a: true, arg: true, _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ a: true, arg: true, _: ['file'] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ a: true, arg: true, _: [50] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ a: true, arg: true, _: [50, 'file'] })
  })

  test('with one string argument definition with alias', () => {
    const definitions = { arg: { alias: 'a', type: 'string' } }

    expect(parseRunnableArguments(definitions, [])).toStrictEqual({ _: [] })
    expect(parseRunnableArguments(definitions, ['-a'])).toStrictEqual({ a: '', arg: '', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg'])).toStrictEqual({ a: '', arg: '', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', 'file'])).toStrictEqual({ a: 'file', arg: 'file', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50'])).toStrictEqual({ a: '50', arg: '50', _: [] })
    expect(parseRunnableArguments(definitions, ['--arg', '50', 'file'])).toStrictEqual({ a: '50', arg: '50', _: ['file'] })
  })
})
