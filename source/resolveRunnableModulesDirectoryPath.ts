import { existsSync, statSync } from 'fs'
import { resolve } from 'path'

export function resolveRunnableModulesDirectoryPath ():string|undefined {
  const path:string = resolve(process.cwd(), 'run') // TODO: Handle runnables directory possibly not named "run"

  return existsSync(path) && statSync(path).isDirectory() ? path : undefined
}
