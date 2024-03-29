import { pathToFileURL } from 'url'

export async function importModule(path: string, debug = false) {
  try {
    return await import(pathToFileURL(path).toString())
  } catch (error) {
    if (debug) throw error
  }

  return undefined
}
