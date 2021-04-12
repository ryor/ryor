/* eslint-env jest */

describe('Verifies shared/utilities exports', () => {
  test('Three exported functions', () => {
    const exports = require('../../../source/shared/utilities/index')

    expect(Object.keys(exports).length).toBe(3)
    expect(typeof exports.getPathStats).toBe('function')
    expect(typeof exports.isPopulatedObject).toBe('function')
    expect(typeof exports.resolveDirectoryPath).toBe('function')
  })
})
