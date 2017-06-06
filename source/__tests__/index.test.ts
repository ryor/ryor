import {resolve} from 'path'
import {run} from '..'
import {expectedTasksHelpMessage, expectedToolsHelpMessage} from '../utils/__tests__/help.test'

const rootDirectoryPath:string = resolve(__dirname, '../..')

test('Outputs tasks help message when run function is executed with an empty args array', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  process.chdir(testProjectDirectoryPath)
  run([])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTasksHelpMessage)

  jest.clearAllMocks()
})

test('Outputs tools help message when "tools" is only arg passed to run function', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  process.chdir(testProjectDirectoryPath)
  run(['tools'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedToolsHelpMessage)

  jest.clearAllMocks()
})
