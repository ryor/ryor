import { Dirent, promises as fsPromises } from 'fs'
import { parse, resolve } from 'path'
import { requireRunnableModule } from './requireRunnableModule'
import { resolveRunnableModulesDirectoryPath } from './resolveRunnableModulesDirectoryPath'
import type { RunnableModule } from './types'

export async function resolveRunnableModule (name:string, directoryPath?:string):Promise<RunnableModule|undefined> {
  if (!directoryPath) directoryPath = resolveRunnableModulesDirectoryPath()

  if (!directoryPath) return undefined

  const dirents:Dirent[] = await fsPromises.readdir(directoryPath, { withFileTypes: true })

  for (const dirent of dirents) {
    if (parse(dirent.name).name === name) return requireRunnableModule(resolve(directoryPath, name))
  }

  const subdirectories:Dirent[] = dirents.filter((dirent:Dirent):boolean => dirent.isDirectory())

  for (const subdirectory of subdirectories) {
    const resolvedModule:RunnableModule|undefined = await resolveRunnableModule(name, resolve(directoryPath, subdirectory.name))

    if (resolvedModule) return resolvedModule
  }

  return undefined
}
