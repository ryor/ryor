import {red} from 'chalk'
import {exit, fail} from '../source/utils'

test('Exits with and without a message', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value.trim())
  const processExitMock = jest.spyOn(process, 'exit').mockImplementation(() => exitCalled = true)
  let consoleLogValue = ''
  let exitCalled = false

  exit('Exit message')

  expect(consoleLogValue).toBe('Exit message')
  expect(exitCalled).toBe(true)

  consoleLogValue = ''
  exitCalled = false

  exit()

  expect(consoleLogValue).toBe('')
  expect(exitCalled).toBe(true)

  consoleLogMock.mockRestore()
  processExitMock.mockRestore()
})

test('Fails with and without a message', () =>
{
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation((value:string):string => consoleErrorValue = value.trim())
  const processExitMock = jest.spyOn(process, 'exit').mockImplementation((code:number):number => exitCode = code)
  let consoleErrorValue = ''
  let exitCode = 0

  fail('Exit message')

  expect(consoleErrorValue).toBe(red('Exit message'))
  expect(exitCode).toBe(1)

  consoleErrorValue = ''
  exitCode = 0

  fail()

  expect(consoleErrorValue).toBe('')
  expect(exitCode).toBe(1)

  consoleErrorMock.mockRestore()
  processExitMock.mockRestore()
})
