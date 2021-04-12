/* eslint-env jest */

import { DEFAULT_CONSOLE_COLUMN_COUNT } from '../../source/console/constants'
import { getConsoleColumnCount } from '../../source/console/getConsoleColumnCount'

describe('Confirm constant value:', () => {
  test('DEFAULT_CONSOLE_COLUMN_COUNT', () => expect(DEFAULT_CONSOLE_COLUMN_COUNT).toBe(100))
})

describe('Get output column count:', () => {
  const stdoutColumnCount = process.stdout.columns
  const expectedColumnCount = stdoutColumnCount || DEFAULT_CONSOLE_COLUMN_COUNT

  test(expectedColumnCount.toString(), () => {
    expect(getConsoleColumnCount()).toBe(expectedColumnCount)

    process.stdout.columns = 50
    expect(getConsoleColumnCount()).toBe(50)

    process.stdout.columns = undefined
    expect(getConsoleColumnCount()).toBe(DEFAULT_CONSOLE_COLUMN_COUNT)

    process.stdout.columns = stdoutColumnCount
  })
})
