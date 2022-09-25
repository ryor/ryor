import { resolve } from 'path'
import { DEFAULT_PATH_DIVIDER, WINDOWS_PATH_DIVIDER } from '../../source/runner/constants'
import { ensureCorrectPATHValue } from '../../source/runner/ensureCorrectPATHValue'
import { WINDOWS_IDENTIFIER } from '../../source/shared/constants'

describe('Ensures PATH environment variable has correct value', () => {
  const { env } = process
  const PATH = env.PATH
  const projectsDirectoryPath = resolve(__dirname, '../.test-projects/projects')
  let binDirectoryPath, projectDirectoryPath

  afterEach(() => {
    env.PATH = PATH
  })

  test('does not include node_modules/.bin directory when none exists', async () => {
    projectDirectoryPath = resolve(projectsDirectoryPath, 'empty-runnables-directory')
    binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
    process.chdir(projectDirectoryPath)
    await ensureCorrectPATHValue()
    expect(env.PATH.includes(binDirectoryPath)).toBe(false)
  })

  test('includes node_modules/.bin directory when it exists', async () => {
    projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
    process.chdir(projectDirectoryPath)
    await ensureCorrectPATHValue()
    expect(env.PATH.includes(binDirectoryPath)).toBe(true)
  })

  test('handles platform divider character properly', async () => {
    const platform = process.platform

    projectDirectoryPath = resolve(projectsDirectoryPath, 'all')
    binDirectoryPath = resolve(projectDirectoryPath, 'node_modules/.bin')
    process.chdir(projectDirectoryPath)

    Object.defineProperty(process, 'platform', { value: WINDOWS_IDENTIFIER })
    await ensureCorrectPATHValue()
    expect(env.PATH.includes(binDirectoryPath + WINDOWS_PATH_DIVIDER)).toBe(true)

    env.PATH = PATH
    Object.defineProperty(process, 'platform', { value: 'linux' })
    await ensureCorrectPATHValue()
    expect(env.PATH.includes(binDirectoryPath + DEFAULT_PATH_DIVIDER)).toBe(true)

    Object.defineProperty(process, 'platform', { value: platform })
  })
})
