import { Dirent, promises as fs } from 'fs'
import { resolve } from 'path'
import { resolveAllRunnableModulesInDirectory } from './resolveAllRunnableModulesInDirectory'
import { getPathStats } from '../shared'
import type { RunnableModule } from './types'

export async function resolveAllRunnableModules (directoryPath: string, debug: boolean = false): Promise<Map<string, Map<string, RunnableModule>>> {
  const dirents: Dirent[] = await fs.readdir(directoryPath, { withFileTypes: true })
  const modules: Map<string, Map<string, RunnableModule>> = new Map<string, Map<string, RunnableModule>>()
  const untypedModules: Map<string, RunnableModule> = await resolveAllRunnableModulesInDirectory(directoryPath, debug)

  if (untypedModules.size > 0) modules.set('untyped', untypedModules)

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const { name }: Dirent = dirent
      const subdirectoryPath: string = resolve(directoryPath, name)

      if ((await getPathStats(resolve(subdirectoryPath, 'index.js'))) === undefined) {
        const typedModules: Map<string, RunnableModule> = await resolveAllRunnableModulesInDirectory(subdirectoryPath, debug)

        if (typedModules.size > 0) modules.set(name, typedModules)
      }
    }
  }

  return modules
}
