import {bold} from 'chalk'
import {EOL} from 'os'
import {resolve} from 'path'
import {composeHelpItemsList, outputHelpMessage} from '../help'

export const expectedTasksHelpMessage:string =
`${bold('Usage:')} node run <tasks...>

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project
  ${bold('tools ')}    Lists available tools`

export const expectedToolsHelpMessage:string =
`${bold('Usage:')} node run <tools...>

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`

const rootDirectoryPath:string = resolve(__dirname, '../../..')

test('Composes help items lists', ():void =>
{
  expect(composeHelpItemsList('Items', new Map([['key', 'value']]))).toBe(`${bold(`Items:`)}${EOL}${EOL}  ${bold('key')}    value`)
  expect(composeHelpItemsList('Items', new Map([['key', 'value'], ['long-key', 'value']]))).toBe(`${bold(`Items:`)}${EOL}${EOL}  ${bold('key     ')}    value${EOL}  ${bold('long-key')}    value`)
})

test('Outputs tasks help messages', ():void =>
{
  let testProjectDirectoryPath:string = resolve(rootDirectoryPath, 'test-projects/tasks-and-tools')
  let consoleLogValue:string = ''

  jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value)

  process.chdir(testProjectDirectoryPath)

  outputHelpMessage()

  process.chdir(rootDirectoryPath)

  expect(consoleLogValue.trim()).toBe(expectedTasksHelpMessage)

  jest.clearAllMocks()
})
