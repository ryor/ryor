import { resolve } from 'path'
import { isValidDirectoryPath } from './isValidDirectoryPath'

const DEFAULT_RUNNABLES_DIRECTORY_NAME:string = 'run'

export async function resolveRunnableModulesDirectoryPath ():Promise<string|void> {
  const path:string = resolve(process.cwd(), DEFAULT_RUNNABLES_DIRECTORY_NAME) // TODO: Handle other directory names

  if (await isValidDirectoryPath(path)) return path
}
