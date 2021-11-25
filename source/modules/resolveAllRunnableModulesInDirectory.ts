import { Dirent, promises as fs } from 'fs'
import { parse } from 'path'
import { importModule } from './importModule'
import { isValidRunnableModule } from './isValidRunnableModule'
import { resolveModulePath } from './resolveModulePath'
import type { RunnableModule } from './types'

export async function resolveAllRunnableModulesInDirectory (directoryPath: string, debug: boolean = false): Promise<Map<string, RunnableModule>> {
  const dirents: Dirent[] = await fs.readdir(directoryPath, { withFileTypes: true })
  const modules: Map<string, RunnableModule> = new Map()

  for (const dirent of dirents) {
    const { name }: Dirent = dirent
    const modulePath: string | undefined = await resolveModulePath(directoryPath, dirent)

    if (modulePath !== undefined) {
      const module: NodeModule | undefined = await importModule(modulePath, debug)

      if (module !== undefined && isValidRunnableModule(module)) modules.set(parse(name).name, module as RunnableModule)
    }
  }

  return modules
}
