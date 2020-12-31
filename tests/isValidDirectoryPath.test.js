/* eslint-env jest */

import { resolve } from 'path'
import { isValidDirectoryPath } from '../source/isValidDirectoryPath'

describe('Checks for a valid directory path', () => {
  test('returns false when directory is not valid', async () => {
    expect(await isValidDirectoryPath(resolve(__dirname, 'test-projects/empty/run'))).toBe(false)
  })

  test('returns true when directory is valid', async () => {
    expect(await isValidDirectoryPath(resolve(__dirname, 'test-projects/empty-runnables-directory/run'))).toBe(true)
  })
})
