import { dirname } from 'path'
import { getPathStats } from './getPathStats'

export async function resolveDirectoryPath(path: string) {
  const stats = await getPathStats(path)

  return stats?.isDirectory() === true ? path : dirname(path)
}
