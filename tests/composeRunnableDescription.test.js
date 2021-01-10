/* eslint-env jest */

import { composeRunnableDescription } from '../source/composeRunnableDescription'

describe('Compose runnable description', () => {
  test('with no description defined', () => expect(composeRunnableDescription({})).toBeUndefined())

  test('with an invalid description defined', () => {
    let description

    description = []
    expect(composeRunnableDescription({ description })).toBeUndefined()

    description = {}
    expect(composeRunnableDescription({ description })).toBeUndefined()

    description = 1
    expect(composeRunnableDescription({ description })).toBeUndefined()

    description = ''
    expect(composeRunnableDescription({ description })).toBeUndefined()
  })

  test('with description string', () => {
    const description = 'Does a thing'

    expect(composeRunnableDescription({ description })).toBe(description)
  })

  test('with description function', () => {
    const descriptionText = 'Does a thing'
    const description = () => descriptionText

    expect(composeRunnableDescription({ description })).toBe(descriptionText)
  })
})
