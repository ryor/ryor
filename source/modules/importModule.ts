export async function importModule (path: string, debug: boolean = false): Promise<NodeModule | undefined> {
  try {
    return await import(path)
  } catch (error) {
    if (debug) throw error
  }

  return undefined
}
