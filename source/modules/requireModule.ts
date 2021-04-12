import esm from 'esm'

const esmRequire: typeof require = esm(module)

export function requireModule (path: string, debug: boolean = false): NodeModule | undefined {
  try {
    return esmRequire(path)
  } catch (error) {
    if (debug) throw error
  }

  return undefined
}
