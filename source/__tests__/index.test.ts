import {bold, red} from 'chalk'
import {resolve} from 'path'
import {run} from '..'
import {Message} from '../strings'
import {expectedTaskUsageInformation, expectedToolsUsageInformation} from './usage.test'

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

test('Outputs RunnablesRequired message when runnables cannot be resolved', ():void =>
{
  let consoleLogValue:string = ''
  let testProjectDirectoryPath:string

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty')
  process.chdir(testProjectDirectoryPath)
  run(['build'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(Message.Run.RunnablesRequired)

  testProjectDirectoryPath = resolve(rootDirectoryPath, 'test-projects/empty-run')
  process.chdir(testProjectDirectoryPath)
  run(['build'])
  process.chdir(rootDirectoryPath)
  expect(consoleLogValue.trim()).toBe(Message.Run.RunnablesRequired)

  jest.clearAllMocks()
})

test('Outputs error message and exits process with non-zero code when script cannot be resolved', ():void =>
{
  let consoleLogValue:string = ''
  let exitCode:number = 0

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)
  jest.spyOn(process, 'exit').mockImplementation((code:number):number => exitCode = code)

  run(['invalid'])
  expect(consoleLogValue.trim()).toBe(red(`NPS script ${bold('invalid')} could not be resolved`))
  expect(exitCode).toBe(1)

  jest.clearAllMocks()
})
