describe('Confirm constant value:', () => {
  test('DEFAULT_DESCRIPTION', () => {
    const { DEFAULT_DESCRIPTION } = require('../source/composeUsageInformationListItem')

    expect(DEFAULT_DESCRIPTION).toBe('No description provided')
  })
})

describe('Compose usage information list item', () => {
  const { bold } = require('chalk')
  const { DEFAULT_DESCRIPTION, composeUsageInformationListItem } = require('../source/composeUsageInformationListItem')

  test('with only name defined', () => {
    const name = 'runnable'
    const result = composeUsageInformationListItem(name)

    expect(result).toBe(`${bold(name)}    ${DEFAULT_DESCRIPTION}`)
  })

  test('with name and description defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const result = composeUsageInformationListItem(name, description)

    expect(result).toBe(`${bold(name)}    ${description}`)
  })

  test('with name and indent defined', () => {
    const name = 'runnable'
    const indent = '    '
    const result = composeUsageInformationListItem(name, undefined, indent)

    expect(result).toBe(`${indent}${bold(name)}    ${DEFAULT_DESCRIPTION}`)
  })

  test('with name and minNameLength defined', () => {
    const name = 'runnable'
    const minNameLength = 10
    const result = composeUsageInformationListItem(name, undefined, undefined, minNameLength)

    expect(result).toBe(`${bold(`${name}`)}      ${DEFAULT_DESCRIPTION}`)
  })

  test('with name, description and indent defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const indent = '    '
    const result = composeUsageInformationListItem(name, description, indent)

    expect(result).toBe(`${indent}${bold(name)}    ${description}`)
  })

  test('with name, description and minNameLength defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const minNameLength = 10
    const result = composeUsageInformationListItem(name, description, undefined, minNameLength)

    expect(result).toBe(`${bold(name)}      ${description}`)
  })

  test('with name, indent and minNameLength defined', () => {
    const name = 'runnable'
    const indent = '    '
    const minNameLength = 10
    const result = composeUsageInformationListItem(name, undefined, indent, minNameLength)

    expect(result).toBe(`${indent}${bold(name)}      ${DEFAULT_DESCRIPTION}`)
  })

  test('with name, description, indent and minNameLength defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const indent = '    '
    const minNameLength = 10
    const result = composeUsageInformationListItem(name, description, indent, minNameLength)

    expect(result).toBe(`${indent}${bold(name)}      ${description}`)
  })
})
