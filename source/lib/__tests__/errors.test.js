const {handleError} = require('../errors')

test('Handles errors', () =>
{
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(value => output = value)
  const processExitMock = jest.spyOn(process, 'exit').mockImplementation(code => exitCode = code)
  let error = new SyntaxError('Syntax Error Message')
  let output = ''
  let exitCode = 0

  handleError(error)
  expect(output.trim()).toBe(error.stack)
  expect(exitCode).toBe(1)

  error = new Error('Error Message')
  output = ''
  exitCode = 0

  handleError(error)
  expect(output.trim()).toBe(error.message)
  expect(exitCode).toBe(1)

  error = 'Error Message'
  output = ''
  exitCode = 0

  handleError(error)
  expect(output.trim()).toBe(error)
  expect(exitCode).toBe(1)

  consoleErrorMock.mockRestore()
  processExitMock.mockRestore()
})
