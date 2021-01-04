/* eslint-env jest */

import { resolve } from 'path'
import { getPathStats } from '../source/getPathStats'

describe('Gets path stats', () => {
  test('returns undefined when path is not valid', async () => {
    expect(await getPathStats('./invalid/path')).toBe(undefined)
  })

  test('returns stats object when path is valid', async () => {
    let stats

    stats = await getPathStats(resolve(__dirname, 'test-projects/all/run'))
    expect(stats).toBeDefined()
    expect(stats.isDirectory()).toBe(true)

    stats = await getPathStats(resolve(__dirname, 'test-projects/all/run/git.js'))
    expect(stats).toBeDefined()
    expect(stats.isFile()).toBe(true)
  })
})
