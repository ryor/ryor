/* eslint-env jest */

import { DEFAULT_OUTPUT_COLUMN_COUNT, getOutputColumnCount } from '../source/getOutputColumnCount'

describe('Confirm constant value:', () => {
  test('DEFAULT_OUTPUT_COLUMN_COUNT', () => expect(DEFAULT_OUTPUT_COLUMN_COUNT).toBe(100))
})

describe('Get output column count:', () => {
  const stdoutColumnCount = process.stdout.columns
  const expectedColumnCount = stdoutColumnCount || DEFAULT_OUTPUT_COLUMN_COUNT

  test(expectedColumnCount.toString(), () => {
    expect(getOutputColumnCount()).toBe(expectedColumnCount)

    process.stdout.columns = 50
    expect(getOutputColumnCount()).toBe(50)

    process.stdout.columns = undefined
    expect(getOutputColumnCount()).toBe(DEFAULT_OUTPUT_COLUMN_COUNT)

    process.stdout.columns = stdoutColumnCount
  })
})
