import { Dirent, promises as fsPromises, existsSync } from 'fs'
import { resolve } from 'path'
import { resolveAllRunnableModulesInDirectory } from './resolveAllRunnableModulesInDirectory'
import { resolveRunnableModulesDirectoryPath } from './resolveRunnableModulesDirectoryPath'
import type { RunnableModule } from './types'

export async function resolveAllRunnableModules ():Promise<Map<string, Map<string, RunnableModule>>> {
  const directoryPath:string|undefined = resolveRunnableModulesDirectoryPath()
  const modules:Map<string, Map<string, RunnableModule>> = new Map<string, Map<string, RunnableModule>>()

  if (directoryPath) {
    const dirents:Dirent[] = await fsPromises.readdir(directoryPath, { withFileTypes: true })
    const untypedModules:Map<string, RunnableModule> = await resolveAllRunnableModulesInDirectory(directoryPath)

    if (untypedModules.size > 0) modules.set('untyped', untypedModules)

    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const { name }:Dirent = dirent
        const subdirectoryPath:string = resolve(directoryPath, name)

        if (!existsSync(resolve(subdirectoryPath, 'index.js'))) {
          const typedModules:Map<string, RunnableModule> = await resolveAllRunnableModulesInDirectory(subdirectoryPath)

          if (typedModules.size > 0) modules.set(name, typedModules)
        }
      }
    }
  }

  return modules
}