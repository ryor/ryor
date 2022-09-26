import { resolveDirectoryPath } from '../../../source/shared/utilities/resolveDirectoryPath'

describe('Resolves directory path', () => {
  test('with directory path', async () => {
    expect(await resolveDirectoryPath(__dirname)).toBe(__dirname)
  })

  test('with file path', async () => {
    expect(await resolveDirectoryPath(__filename)).toBe(__dirname)
  })
})
