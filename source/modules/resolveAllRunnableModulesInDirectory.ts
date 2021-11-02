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

/*
async function resolveAllRunnableModulesInDirectory(directoryPath, debug = false) {
    const dirents = await promises.readdir(directoryPath, { withFileTypes: true });
    const modulePaths = (await Promise.all(dirents.map(dirent => resolveModulePath(directoryPath, dirent)))).filter(path => path !== undefined)
    const modules = (await Promise.all(modulePaths.map(modulePath => importModule(modulePath, debug))))
    const runnableModules = modules.reduce((map, module, index) => {
        if (module !== undefined && isValidRunnableModule(module)) map.set(parse(modulePaths[index]).name, module)

        return map
    }, new Map())

    return runnableModules
}
*/
