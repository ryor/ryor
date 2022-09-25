import { resolve } from 'path'
import { WINDOWS_IDENTIFIER, getPathStats } from '../shared'
import { DEFAULT_PATH_DIVIDER, WINDOWS_PATH_DIVIDER } from './constants'

export async function ensureCorrectPATHValue(): Promise<void> {
  const binDirectoryPath: string = resolve(process.cwd(), 'node_modules/.bin')

  if ((await getPathStats(binDirectoryPath)) !== undefined) {
    const PATH: string = process.env.PATH ?? ''

    if (!PATH.includes(binDirectoryPath))
      process.env.PATH = `${binDirectoryPath}${process.platform === WINDOWS_IDENTIFIER ? WINDOWS_PATH_DIVIDER : DEFAULT_PATH_DIVIDER}${PATH}`
  }
}
