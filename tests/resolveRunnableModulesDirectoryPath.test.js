/* eslint-env jest */

import { resolve } from 'path'
import { resolveRunnableModulesDirectoryPath } from '../source/resolveRunnableModulesDirectoryPath'

describe('Resolve runnable modules directory path', () => {
  test('returns undefined when directory is not resolved', async () => {
    process.chdir(resolve(__dirname, 'test-projects/empty'))
    expect(await resolveRunnableModulesDirectoryPath()).toBe(undefined)
  })

  test('returns path when directory is resolved', async () => {
    const parentDirectoryPath = resolve(__dirname, 'test-projects/empty-runnables-directory')
    const expectedRunnableModulesDirectoryPath = resolve(parentDirectoryPath, 'run')

    process.chdir(parentDirectoryPath)

    expect(await resolveRunnableModulesDirectoryPath()).toBe(expectedRunnableModulesDirectoryPath)
  })
})
