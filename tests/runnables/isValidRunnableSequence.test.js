import { isValidRunnableSequence } from '../../source/runnables/isValidRunnableSequence'

describe('Checks for a valid runnable sequence', () => {
  test('returns false for individual invalid runnables', () => {
    expect(isValidRunnableSequence()).toEqual(false)
    expect(isValidRunnableSequence(undefined)).toEqual(false)
    expect(isValidRunnableSequence(null)).toEqual(false)
    expect(isValidRunnableSequence('')).toEqual(false)
    expect(isValidRunnableSequence({})).toEqual(false)
    expect(isValidRunnableSequence(3.14)).toEqual(false)
    expect(isValidRunnableSequence(true)).toEqual(false)
    expect(isValidRunnableSequence(false)).toEqual(false)
  })

  test('returns false for empty arrays or arrays that contain invalid runnables', () => {
    expect(isValidRunnableSequence([])).toEqual(false)
    expect(isValidRunnableSequence(['build', undefined])).toEqual(false)
    expect(isValidRunnableSequence(['test', null])).toEqual(false)
    expect(isValidRunnableSequence([() => 'transpile', ''])).toEqual(false)
    expect(isValidRunnableSequence([async () => null, {}])).toEqual(false)
    expect(isValidRunnableSequence(['lint --verbose ./**/*.*', 3.14])).toEqual(false)
    expect(isValidRunnableSequence([() => undefined, true])).toEqual(false)
    expect(isValidRunnableSequence([async () => {}, false])).toEqual(false)
  })

  test('returns true for arrays of valid runnables', () => {
    expect(isValidRunnableSequence(['build', () => {}, async () => {}])).toEqual(true)
  })

  test('returns false for arrays of valid runnables but invalid child sequences', () => {
    expect(isValidRunnableSequence(['build', ['test', null], () => {}, async () => {}])).toEqual(false)
  })

  test('returns true for arrays of valid runnables and child sequences', () => {
    expect(isValidRunnableSequence(['build', ['test', () => {}, async () => {}], () => {}, async () => {}])).toEqual(true)
  })
})
