/* eslint-env jest */
const { Runner } = require('../Runner')

test('Initializes Runner instances', () => {
  let runner = new Runner()

  expect(runner.sequence).toEqual([])
  expect(runner.context).toBeUndefined()

  runner = new Runner(['test', 'build'])

  expect(runner.sequence).toEqual(['test', 'build'])
  expect(runner.context).toBeUndefined()

  runner = new Runner(['echo Transpiling', 'transpiler --arg value'], 'transpiler')

  expect(runner.sequence).toEqual(['echo Transpiling', 'transpiler --arg value'])
  expect(runner.context).toBe('transpiler')
})
