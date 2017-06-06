import {resolve} from 'path'
import {getRunnables, resolveRunnable} from '../runnables'

const rootDirectoryPath:string = resolve(__dirname, '../../..')
const expectedTaskRunnableKeys:string[] = ['build', 'deploy', 'test']
const expectedToolRunnableKeys:string[] = ['bundler', 'tester', 'transpiler']

function getTestProjectRunnables(project:string, type:string):Map<string, Runnable>|undefined
{
  const directoryPath:string = resolve(rootDirectoryPath, `test-projects/${project}`)

  process.chdir(directoryPath)

  const runnables:Map<string, Runnable>|undefined = getRunnables(type)

  process.chdir(rootDirectoryPath)

  return runnables
}

test('Gets task runnables', ():void =>
{
  let tasks:Map<string, Runnable>|undefined

  tasks = getTestProjectRunnables('empty', 'tasks')
  expect(tasks).toBeUndefined()

  tasks = getTestProjectRunnables('empty-run', 'tasks')
  expect(tasks).toBeUndefined()

  tasks = getTestProjectRunnables('only-tasks', 'tasks')
  expect(Array.from(tasks!.keys()).sort()).toEqual(expectedTaskRunnableKeys)

  tasks = getTestProjectRunnables('only-tools', 'tasks')
  expect(tasks).toBeUndefined()

  tasks = getTestProjectRunnables('tasks-and-tools', 'tasks')
  expect(Array.from(tasks!.keys()).sort()).toEqual(expectedTaskRunnableKeys)
})

test('Gets tool runnables', ():void =>
{
  let tools:Map<string, Runnable>|undefined

  tools = getTestProjectRunnables('empty', 'tasks')
  expect(tools).toBeUndefined()

  tools = getTestProjectRunnables('empty-run', 'tasks')
  expect(tools).toBeUndefined()

  tools = getTestProjectRunnables('only-tasks', 'tools')
  expect(tools).toBeUndefined()

  tools = getTestProjectRunnables('only-tools', 'tools')
  expect(Array.from(tools!.keys()).sort()).toEqual(expectedToolRunnableKeys)

  tools = getTestProjectRunnables('tasks-and-tools', 'tools')
  expect(Array.from(tools!.keys()).sort()).toEqual(expectedToolRunnableKeys)
})

test('Resolves runnables', ():void =>
{
  let directoryPath:string
  let runnable:Runnable|undefined

  directoryPath = resolve(rootDirectoryPath, `test-projects/empty`)
  process.chdir(directoryPath)
  runnable = resolveRunnable('build')
  expect(runnable).toBeUndefined()
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, `test-projects/empty-run`)
  process.chdir(directoryPath)
  runnable = resolveRunnable('build')
  expect(runnable).toBeUndefined()
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, `test-projects/only-tasks`)
  process.chdir(directoryPath)
  runnable = resolveRunnable('build')
  expect(runnable).toBeDefined()
  runnable = resolveRunnable('bundler')
  expect(runnable).toBeUndefined()
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, `test-projects/only-tools`)
  process.chdir(directoryPath)
  runnable = resolveRunnable('build')
  expect(runnable).toBeUndefined()
  runnable = resolveRunnable('bundler')
  expect(runnable).toBeDefined()
  process.chdir(rootDirectoryPath)

  directoryPath = resolve(rootDirectoryPath, `test-projects/tasks-and-tools`)
  process.chdir(directoryPath)
  runnable = resolveRunnable('build')
  expect(runnable).toBeDefined()
  runnable = resolveRunnable('bundler')
  expect(runnable).toBeDefined()
  process.chdir(rootDirectoryPath)
})
