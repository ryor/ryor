import { resolve } from 'path'
import { getPathStats } from '../shared'

export async function resolveModulePath(directoryPath: string, name: string) {
  let path = resolve(directoryPath, `${name}.js`)
  let stats = await getPathStats(path)

  if (stats && stats.isFile()) return path

  path = resolve(directoryPath, name, 'index.js')
  stats = await getPathStats(path)

  if (stats && stats.isFile()) return path

  return undefined
}
