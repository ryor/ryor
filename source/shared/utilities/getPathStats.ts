/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import { Stats, promises as fs } from 'fs'

export async function getPathStats(path: string): Promise<Stats | undefined> {
  try {
    return await fs.stat(path)
  } catch (error) {}

  return undefined
}
