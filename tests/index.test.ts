import {red} from 'chalk'
import {resolve} from 'path'
import {run} from '../source'

const rootDirectoryPath = resolve(__dirname, '..')

test('Outputs no modules resolved error message', () =>
{
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation((value:string):string => consoleErrorValue = value.trim())
  const processExitMock = jest.spyOn(process, 'exit').mockImplementation((code:number):number => exitCode = code)
  let consoleErrorValue = ''
  let exitCode = 0

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty`))

  run()

  expect(consoleErrorValue).toBe(red('Could not resolve any tasks or tools'))
  expect(exitCode).toBe(1)

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty-run`))

  exitCode = 0

  run()

  expect(consoleErrorValue).toBe(red('Could not resolve any tasks or tools'))
  expect(exitCode).toBe(1)

  process.chdir(rootDirectoryPath)

  consoleErrorMock.mockRestore()
  processExitMock.mockRestore()
})
