/* eslint-env jest */
const index = require('..')

test('Confirms module exports', () => {
  expect(index.run).toBeDefined()
  expect(index.CommandRunnable).toBeDefined()
  expect(index.FunctionRunnable).toBeDefined()
  expect(index.composeUsageInformationList).toBeDefined()
})
