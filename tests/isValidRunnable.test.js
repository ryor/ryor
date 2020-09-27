describe('Checks for a valid runnable', () => {
  const { isValidRunnable } = require('../source/isValidRunnable')

  test('returns false for falsy values', () => {
    expect(isValidRunnable()).toEqual(false)
    expect(isValidRunnable(undefined)).toEqual(false)
    expect(isValidRunnable(null)).toEqual(false)
    expect(isValidRunnable('')).toEqual(false)
  })

  test('returns false for values that are not strings or functions', () => {
    expect(isValidRunnable({})).toEqual(false)
    expect(isValidRunnable(3.14)).toEqual(false)
    expect(isValidRunnable(true)).toEqual(false)
    expect(isValidRunnable(false)).toEqual(false)
  })

  test('returns true for strings', () => {
    expect(isValidRunnable('runnable')).toEqual(true)
    expect(isValidRunnable('runnable --quiet')).toEqual(true)
    expect(isValidRunnable('runnable --verbose ./**/*.*')).toEqual(true)
  })

  test('returns true for functions', () => {
    expect(isValidRunnable(() => {})).toEqual(true)
    expect(isValidRunnable(async () => {})).toEqual(true)
    expect(isValidRunnable(() => new Promise(resolve => { console.log('hello world'); resolve() }))).toEqual(true)
  })
})
