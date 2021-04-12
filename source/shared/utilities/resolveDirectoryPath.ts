import { Stats } from 'fs'
import { dirname } from 'path'
import { getPathStats } from './getPathStats'

export async function resolveDirectoryPath (path: string): Promise<string> {
  const stats: Stats | undefined = await getPathStats(path)

  return stats?.isDirectory() === true ? path : dirname(path)
}
