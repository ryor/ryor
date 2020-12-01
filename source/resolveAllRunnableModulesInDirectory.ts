import { Dirent, promises as fs, existsSync } from 'fs'
import { parse, resolve } from 'path'
import { requireRunnableModule } from './requireRunnableModule'
import type { RunnableModule } from './types'

export async function resolveAllRunnableModulesInDirectory (directoryPath:string):Promise<Map<string, RunnableModule>> {
  const dirents:Dirent[] = await fs.readdir(directoryPath, { withFileTypes: true })
  const modules:Map<string, RunnableModule> = new Map()

  for (const dirent of dirents) {
    const { name }:Dirent = dirent
    let runnableModule:RunnableModule|undefined

    if ((dirent.isFile() && name.endsWith('.js')) || (dirent.isDirectory() && existsSync(resolve(directoryPath, name, 'index.js')))) {
      try {
        runnableModule = requireRunnableModule(resolve(directoryPath, name))
      } catch (error) {}

      if (runnableModule) modules.set(parse(name).name, runnableModule)
    }
  }

  return modules
}
