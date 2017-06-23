import {bold} from 'chalk'
import {resolve} from 'path'
import {deleteModulesMap} from '../../source/utils/modules'
import {composeUsageInformation} from '../../source/utils/usage'

export const expectedUsageInformation = {

  'only-tasks':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project`,

  'only-tools':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`,

  'tasks-and-tools':

`${bold('Usage:')} node run <runnable> [args...] [+ <runnable> [args...]] ...

${bold('Tasks:')}

  ${bold('build ')}    Builds project
  ${bold('deploy')}    No description provided
  ${bold('test  ')}    Tests project

${bold('Tools:')}

  ${bold('bundler   ')}    Bundles code
  ${bold('tester    ')}    No description provided
  ${bold('transpiler')}    Transpiles code`

}

const rootDirectoryPath = resolve(__dirname, '../..')

test('Composes usage information', () =>
{
  let runnableModules

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-tasks'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-tasks'])

  deleteModulesMap()

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/only-tools'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['only-tools'])

  deleteModulesMap()

  process.chdir(resolve(rootDirectoryPath, 'tests/projects/tasks-and-tools'))
  expect(composeUsageInformation()).toBe(expectedUsageInformation['tasks-and-tools'])

  process.chdir(rootDirectoryPath)
})
