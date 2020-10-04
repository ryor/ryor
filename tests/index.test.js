/* eslint-env jest */

import { composeUsageInformationList, runCommandLineInput } from '../source'

test('Module exports two functions: composeUsageInformationList and runCommandLineInput', () => {
  expect(typeof composeUsageInformationList).toBe('function')
  expect(typeof runCommandLineInput).toBe('function')
})
