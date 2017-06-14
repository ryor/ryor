import {resolve} from 'path'
import {run} from '../source'

const rootDirectoryPath = resolve(__dirname, '..')

test('Outputs no modules resolved error message', () =>
{
  const consoleLogMock = jest.spyOn(console, 'log').mockImplementation((value:string):string => consoleLogValue = value.trim())
  let consoleLogValue = ''

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty`))

  run()

  expect(consoleLogValue).toBe('Add tasks and/or tools to proceed')

  process.chdir(resolve(rootDirectoryPath, `tests/projects/empty-run`))

  run()

  expect(consoleLogValue).toBe('Add tasks and/or tools to proceed')

  process.chdir(rootDirectoryPath)

  consoleLogMock.mockRestore()
})
