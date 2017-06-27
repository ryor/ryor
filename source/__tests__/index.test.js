const {resolve} = require('path')
const {run} = require('..')

test('Adds node_modules/.bin directory to PATH if neccesary', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(value => {})
  const binDirectoryPath = resolve(process.cwd(), 'node_modules/.bin')

  if (process.env.PATH.includes(binDirectoryPath))
    process.env.PATH = process.env.PATH.replace(binDirectoryPath, '')

  expect(process.env.PATH.includes(binDirectoryPath)).toBe(false)

  run()

  expect(process.env.PATH.includes(binDirectoryPath)).toBe(true)

  consoleLogMock.mockRestore()
})

test('Outputs usage information when no input values are passed to run function', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(value => logValue = value)
  let logValue = ''

  run()

  expect(logValue).not.toBe('')

  consoleLogMock.mockRestore()
})
