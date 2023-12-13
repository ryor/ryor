import { isPopulatedObject } from '../../../source/shared/utilities/isPopulatedObject'

describe('Determine if value is a populated object', () => {
  test('returns false when value is not a populated object', () => {
    expect(isPopulatedObject(undefined)).toBe(false)
    expect(isPopulatedObject(false)).toBe(false)
    expect(isPopulatedObject(1)).toBe(false)
    expect(isPopulatedObject([])).toBe(false)
    expect(isPopulatedObject({})).toBe(false)
  })

  test('returns true when value is a populated object', () => {
    expect(isPopulatedObject({ foo: 'foo' })).toBe(true)
  })
})
