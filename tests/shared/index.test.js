/* eslint-env jest */

describe('Verifies shared exports', () => {
  test('Two exported constants, three exported functions and one exported error class', () => {
    const exports = require('../../source/shared/index')

    expect(Object.keys(exports).length).toBe(5)
    expect(typeof exports.LINE_BREAK).toBe('string')
    expect(typeof exports.WINDOWS_IDENTIFIER).toBe('string')
    expect(typeof exports.getPathStats).toBe('function')
    expect(typeof exports.isPopulatedObject).toBe('function')
    expect(typeof exports.resolveDirectoryPath).toBe('function')
  })
})
