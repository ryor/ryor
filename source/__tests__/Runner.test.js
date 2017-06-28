const {resolve} = require('path')
const {Runner} = require('../Runner')

test('Initializes Runner instances', () =>
{
  let runner = new Runner()

  expect(runner.definitions).toEqual([])
  expect(runner.context).toBeUndefined()

  runner = new Runner(['test', 'build'])

  expect(runner.definitions).toEqual(['test', 'build'])
  expect(runner.context).toBeUndefined()

  runner = new Runner(['echo Transpiling', 'transpiler --arg value'], 'transpiler')

  expect(runner.definitions).toEqual(['echo Transpiling', 'transpiler --arg value'])
  expect(runner.context).toBe('transpiler')
})

test('Confirms calling Runner instance run() just calls Runner instance next()', () =>
{
  const runner = new Runner()
  let nextCalled = false

  runner.next = () => nextCalled = true

  runner.run()

  expect(nextCalled).toBe(true)
})
