import { pathToFileURL } from 'url'

export async function importModule (path: string, debug: boolean = false): Promise<NodeModule | undefined> {
  try {
    return await import(pathToFileURL(path).toString())
  } catch (error) {
    if (debug) throw error
  }

  return undefined
}
