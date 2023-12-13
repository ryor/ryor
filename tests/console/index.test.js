describe('Verify shared exports', () => {
  test('Three exported functions', () => {
    const exports = require('../../source/console/index')

    expect(Object.keys(exports).length).toBe(3)
    expect(typeof exports.getConsoleColumnCount).toBe('function')
    expect(typeof exports.parseConsoleInput).toBe('function')
    expect(typeof exports.truncateConsoleOutput).toBe('function')
  })
})
