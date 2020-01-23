/* eslint-env jest */
test('Confirms module exports', () => {
  const moduleExports = require('..')

  expect(moduleExports.run).toBeDefined()
  expect(moduleExports.CommandRunnable).toBeDefined()
  expect(moduleExports.FunctionRunnable).toBeDefined()
  expect(moduleExports.composeUsageInformationList).toBeDefined()
})
