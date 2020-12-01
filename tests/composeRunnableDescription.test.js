/* eslint-env jest */

import { bold } from 'chalk'
import { USAGE_TIP_TEMPLATE, composeRunnableDescription } from '../source/composeRunnableDescription'

describe('Confirm constant values:', () => {
  test('USAGE_TIP_TEMPLATE', () => expect(USAGE_TIP_TEMPLATE).toBe(`Use ${bold.underline('node run help [NAME]')} for detailed usage information.`))
})

describe('Compose runnable description', () => {
  test('with no description or usage defined', () => expect(composeRunnableDescription('runnable', {})).toBe(''))

  test('with description string and no usage defined', () => {
    const description = 'Does a thing'

    expect(composeRunnableDescription('runnable', { description })).toBe(description)
  })

  test('with description function and no usage defined', () => {
    const descriptionText = 'Does a thing'
    const description = () => descriptionText

    expect(composeRunnableDescription('runnable', { description })).toBe(descriptionText)
  })

  test('with no description and usage defined', () => {
    const args = { arg: { boolean: true } }
    const name = 'runnable'

    expect(composeRunnableDescription(name, { args })).toBe('')
    expect(composeRunnableDescription(name, { args }, true)).toBe(USAGE_TIP_TEMPLATE.replace('[NAME]', name))
  })

  test('with description string (that doesn\'t end with a period) and usage defined', () => {
    const args = { arg: { boolean: true } }
    const description = 'Does a thing'
    const name = 'runnable'

    expect(composeRunnableDescription(name, { args, description })).toBe(description)
    expect(composeRunnableDescription(name, { args, description }, true)).toBe(`${description}. ${USAGE_TIP_TEMPLATE.replace('[NAME]', name)}`)
  })

  test('with description string (that ends with a period) and usage defined', () => {
    const args = { arg: { boolean: true } }
    const description = 'Does a thing.'
    const name = 'runnable'

    expect(composeRunnableDescription(name, { args, description })).toBe(description)
    expect(composeRunnableDescription(name, { args, description }, true)).toBe(`${description} ${USAGE_TIP_TEMPLATE.replace('[NAME]', name)}`)
  })
})
