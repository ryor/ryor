import {resolve} from 'path'
import {run} from '..'
import {expectedTaskUsageInformation, expectedToolsUsageInformation} from '../utils/__tests__/usage.test'

const rootDirectoryPath:string = resolve(__dirname, '../..')

test('Outputs tasks usage information when run function is executed with an empty args array', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  process.chdir(testProjectDirectoryPath)
  run([])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedTaskUsageInformation['tasks-and-tools'])

  jest.clearAllMocks()
})

test('Outputs tools usage information when "tools" is only arg passed to run function', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  process.chdir(testProjectDirectoryPath)
  run(['tools'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(expectedToolsUsageInformation)

  jest.clearAllMocks()
})
