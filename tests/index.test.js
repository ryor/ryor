test('Module exports two functions: composeUsageInformationList and runCommandLineInput', () => {
  const moduleExports = require('../source')

  expect(Object.keys(moduleExports).length).toBe(2)
  expect(typeof moduleExports.composeUsageInformationList).toBe('function')
  expect(typeof moduleExports.runCommandLineInput).toBe('function')
})
