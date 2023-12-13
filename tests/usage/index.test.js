describe('Verify shared exports', () => {
  test('One exported function', () => {
    const exports = require('../../source/usage/index')

    expect(Object.keys(exports).length).toBe(1)
    expect(typeof exports.outputUsageInformation).toBe('function')
  })
})
