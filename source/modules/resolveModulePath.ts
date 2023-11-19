import { Dirent, Stats } from 'fs'
import { resolve } from 'path'
import { getPathStats } from '../shared'

export async function resolveModulePath(directoryPath: string, dirent: Dirent): Promise<string | undefined> {
  const { name }: Dirent = dirent

  if (dirent.isFile()) {
    if (name.endsWith('.js')) return resolve(directoryPath, name)
  } else if (dirent.isDirectory()) {
    const path: string = resolve(directoryPath, name, 'index.js')
    const stats: Stats | undefined = await getPathStats(path)

    if (stats !== undefined && stats.isFile()) return path
  }

  return undefined
}
