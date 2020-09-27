describe('Compose runnable description', () => {
  const { bold } = require('chalk')
  const { composeRunnableDescription } = require('../source/composeRunnableDescription')

  test('with no description or usage defined', () => {
    expect(composeRunnableDescription('runnable', {})).toBe('')
  })

  test('with description string and no usage defined', () => {
    const name = 'runnable'
    const description = 'Does a thing'

    expect(composeRunnableDescription(name, { description })).toBe(description)
  })

  test('with description function and no usage defined', () => {
    const name = 'runnable'
    const descriptionText = 'Does a thing'
    const description = () => descriptionText

    expect(composeRunnableDescription(name, { description })).toBe(descriptionText)
  })

  test('with no description and usage defined', () => {
    const name = 'runnable'
    const usage = 'Just use it.'

    expect(composeRunnableDescription(name, { usage })).toBe('')
    expect(composeRunnableDescription(name, { usage }, true)).toBe(`Use ${bold.underline(`node run help ${name}`)} for detailed usage information.`)
  })

  test('with description string (that doesn\'t end with a period) and usage defined', () => {
    const name = 'runnable'
    const description = 'Does a thing'
    const usage = () => 'Just use it.'

    expect(composeRunnableDescription(name, { description, usage })).toBe(description)
    expect(composeRunnableDescription(name, { description, usage }, true)).toBe(`${description}. Use ${bold.underline(`node run help ${name}`)} for detailed usage information.`)
  })

  test('with description string (that ends with a period) and usage defined', () => {
    const name = 'runnable'
    const description = 'Does a thing.'
    const usage = () => 'Just use it.'

    expect(composeRunnableDescription(name, { description, usage })).toBe(description)
    expect(composeRunnableDescription(name, { description, usage }, true)).toBe(`${description} Use ${bold.underline(`node run help ${name}`)} for detailed usage information.`)
  })
})
