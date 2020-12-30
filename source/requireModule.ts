import esm from 'esm'

const esmRequire: typeof require = esm(module)

export function requireModule (path: string, suppressErrors: boolean = true): NodeModule | undefined {
  try {
    return esmRequire(path)
  } catch (error) {
    if (!suppressErrors) throw error
  }

  return undefined
}
