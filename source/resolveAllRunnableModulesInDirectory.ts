import { Dirent, promises as fs, existsSync } from 'fs'
import { parse, resolve } from 'path'
import { isValidRunnableModule } from './isValidRunnableModule'
import { requireModule } from './requireModule'
import type { RunnableModule } from './types'

export async function resolveAllRunnableModulesInDirectory (directoryPath: string): Promise<Map<string, RunnableModule>> {
  const dirents: Dirent[] = await fs.readdir(directoryPath, { withFileTypes: true })
  const modules: Map<string, RunnableModule> = new Map()

  for (const dirent of dirents) {
    const { name }: Dirent = dirent

    if ((dirent.isFile() && name.endsWith('.js')) || (dirent.isDirectory() && existsSync(resolve(directoryPath, name, 'index.js')))) {
      const module: NodeModule|undefined = requireModule(resolve(directoryPath, name))

      if (module !== undefined && isValidRunnableModule(module)) modules.set(parse(name).name, module as RunnableModule)
    }
  }

  return modules
}
