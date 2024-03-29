import { resolve } from 'path'
import { getPathStats } from '../../../source/shared/utilities/getPathStats'

describe('Get path stats', () => {
  test('returns undefined when path is not valid', async () => {
    expect(await getPathStats('./invalid/path')).toBe(undefined)
  })

  test('returns stats object when path is valid', async () => {
    const projectsDirectoryPath = resolve(__dirname, '../../.test-projects/projects')
    let stats

    stats = await getPathStats(resolve(projectsDirectoryPath, 'all/tasks'))
    expect(stats).toBeDefined()
    expect(stats.isDirectory()).toBe(true)

    stats = await getPathStats(resolve(projectsDirectoryPath, 'all/tasks/git.js'))
    expect(stats).toBeDefined()
    expect(stats.isFile()).toBe(true)
  })
})
