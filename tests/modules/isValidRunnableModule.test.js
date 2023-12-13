import { isValidRunnableModule } from '../../source/modules/isValidRunnableModule'

describe('Check for a valid runnable module', () => {
  test('returns false for values of the wrong type or empty objects', () => {
    expect(isValidRunnableModule()).toEqual(false)
    expect(isValidRunnableModule(undefined)).toEqual(false)
    expect(isValidRunnableModule(null)).toEqual(false)
    expect(isValidRunnableModule(true)).toEqual(false)
    expect(isValidRunnableModule(false)).toEqual(false)
    expect(isValidRunnableModule(3.14)).toEqual(false)
    expect(isValidRunnableModule('')).toEqual(false)
    expect(isValidRunnableModule([])).toEqual(false)
    expect(isValidRunnableModule({})).toEqual(false)
  })

  test('returns false for objects containing invalid runnables', () => {
    expect(isValidRunnableModule({ run: undefined })).toEqual(false)
    expect(isValidRunnableModule({ run: null })).toEqual(false)
    expect(isValidRunnableModule({ run: true })).toEqual(false)
    expect(isValidRunnableModule({ run: false })).toEqual(false)
    expect(isValidRunnableModule({ run: 3.14 })).toEqual(false)
    expect(isValidRunnableModule({ run: '' })).toEqual(false)
    expect(isValidRunnableModule({ run: [] })).toEqual(false)
    expect(isValidRunnableModule({ run: {} })).toEqual(false)
  })

  test('returns true for valid modules', () => {
    expect(isValidRunnableModule({ run: 'lint --verbose ./**/*.*' })).toEqual(true)
    expect(isValidRunnableModule({ run: () => {} })).toEqual(true)
    expect(isValidRunnableModule({ run: async () => {} })).toEqual(true)
    expect(isValidRunnableModule({ run: ['build', () => {}, async () => {}] })).toEqual(true)
    expect(isValidRunnableModule({ run: ['build', ['test', () => {}, async () => {}], () => {}, async () => {}] })).toEqual(true)
  })
})
