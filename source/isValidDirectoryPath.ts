import { Stats, promises as fs } from 'fs'

export async function isValidDirectoryPath (path:string):Promise<boolean> {
  try {
    const stats:Stats = await fs.stat(path)

    return stats.isDirectory()
  } catch (error) {}

  return false
}
