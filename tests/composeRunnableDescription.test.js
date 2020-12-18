/* eslint-env jest */

import { bold } from 'chalk'
import { USAGE_TIP_TEMPLATE, composeRunnableDescription } from '../source/composeRunnableDescription'

describe('Confirm constant values:', () => {
  test('USAGE_TIP_TEMPLATE', () => expect(USAGE_TIP_TEMPLATE).toBe(`Use ${bold.underline('node [ENTRY_DIRECTORY_NAME] help [NAME]')} for detailed usage information.`))
})

describe('Compose runnable description', () => {
  const configuration = { entry: { directoryName: 'run' } }

  test('with no description or usage defined', () => expect(composeRunnableDescription('runnable', {}, configuration)).toBe(''))

  test('with description string and no usage defined', () => {
    const description = 'Does a thing'

    expect(composeRunnableDescription('runnable', { description }, configuration)).toBe(description)
  })

  test('with description function and no usage defined', () => {
    const descriptionText = 'Does a thing'
    const description = () => descriptionText

    expect(composeRunnableDescription('runnable', { description }, configuration)).toBe(descriptionText)
  })

  test('with no description and usage defined', () => {
    const args = { arg: { boolean: true } }
    const name = 'runnable'

    expect(composeRunnableDescription(name, { args }, configuration)).toBe('')
    expect(composeRunnableDescription(name, { args }, configuration, true)).toBe(USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name))
  })

  test('with description string (that doesn\'t end with a period) and usage defined', () => {
    const args = { arg: { boolean: true } }
    const description = 'Does a thing'
    const name = 'runnable'

    expect(composeRunnableDescription(name, { args, description }, configuration)).toBe(description)
    expect(composeRunnableDescription(name, { args, description }, configuration, true)).toBe(`${description}. ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)}`)
  })

  test('with description string (that ends with a period) and usage defined', () => {
    const args = { arg: { boolean: true } }
    const description = 'Does a thing.'
    const name = 'runnable'

    expect(composeRunnableDescription(name, { args, description }, configuration)).toBe(description)
    expect(composeRunnableDescription(name, { args, description }, configuration, true)).toBe(`${description} ${USAGE_TIP_TEMPLATE.replace('[ENTRY_DIRECTORY_NAME]', 'run').replace('[NAME]', name)}`)
  })
})
