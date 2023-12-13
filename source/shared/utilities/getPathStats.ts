/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import { promises as fs } from 'fs'

export async function getPathStats(path: string) {
  try {
    return await fs.stat(path)
  } catch (error) {}

  return undefined
}
