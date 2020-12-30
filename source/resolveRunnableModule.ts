import { Dirent, promises as fs } from 'fs'
import { parse, resolve } from 'path'
import { isValidRunnableModule } from './isValidRunnableModule'
import { requireModule } from './requireModule'
import type { RunnableModule } from './types'

export async function resolveRunnableModule (name: string, directoryPath: string): Promise<RunnableModule | undefined> {
  const dirents: Dirent[] = await fs.readdir(directoryPath, { withFileTypes: true })

  for (const dirent of dirents) {
    if (parse(dirent.name).name === name) {
      const module: NodeModule|undefined = requireModule(resolve(directoryPath, name))

      if (module !== undefined && isValidRunnableModule(module)) return module as RunnableModule
    }
  }

  const subdirectories: Dirent[] = dirents.filter((dirent: Dirent): boolean => dirent.isDirectory())

  for (const subdirectory of subdirectories) {
    const resolvedModule: RunnableModule | undefined = await resolveRunnableModule(name, resolve(directoryPath, subdirectory.name))

    if (resolvedModule !== undefined) return resolvedModule
  }

  return undefined
}
