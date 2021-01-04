/* eslint-env jest */

import { bold } from 'chalk'
import { EOL } from 'os'
import { composeUsageInformationList } from '../source/composeUsageInformationList'

const EOL2 = EOL + EOL

describe('Compose usage information list', () => {
  test('with no arguments defined', () => expect(composeUsageInformationList()).toBe(''))

  test('with empty items map', () => expect(composeUsageInformationList(new Map())).toBe(''))

  test('with one item', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const result = composeUsageInformationList(new Map([[name, description]]))

    expect(result).toBe(`${bold(name)}    ${description}`)
  })

  test('with two items', () => {
    const name1 = 'test'
    const name2 = 'build'
    const description1 = 'Does a thing.'
    const description2 = 'Does a thing, too.'
    const result = composeUsageInformationList(new Map([[name1, description1], [name2, description2]]))

    expect(result).toBe(`${bold(name1)}     ${description1}${EOL}${bold(name2)}    ${description2}`)
  })

  test('with one item and type defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const type = 'runnables'
    const indent = '  '
    const result = composeUsageInformationList(new Map([[name, description]]), type)

    expect(result).toBe(`${bold('Runnables:')}${EOL2}${indent}${bold(name)}    ${description}`)
  })

  test('with one item and minNameLength defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const minNameLength = 10
    const result = composeUsageInformationList(new Map([[name, description]]), undefined, minNameLength)

    expect(result).toBe(`${bold(name)}      ${description}`)
  })

  test('with one item, type and minNameLength defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const type = 'runnables'
    const minNameLength = 10
    const indent = '  '
    const result = composeUsageInformationList(new Map([[name, description]]), type, minNameLength)

    expect(result).toBe(`${bold('Runnables:')}${EOL2}${indent}${bold(name)}      ${description}`)
  })

  test('with two items, type and minNameLength defined', () => {
    const name1 = 'test'
    const name2 = 'build'
    const description1 = 'Does a thing.'
    const description2 = 'Does a thing, too.'
    const type = 'runnables'
    const minNameLength = 10
    const indent = '  '
    const result = composeUsageInformationList(new Map([[name1, description1], [name2, description2]]), type, minNameLength)

    expect(result).toBe(`${bold('Runnables:')}${EOL2}${indent}${bold(name1)}          ${description1}${EOL}${indent}${bold(name2)}         ${description2}`)
  })
})
