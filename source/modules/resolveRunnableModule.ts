import { Dirent, promises as fs } from 'fs'
import { parse, resolve } from 'path'
import { isValidRunnableModule } from './isValidRunnableModule'
import { requireModule } from './requireModule'
import type { RunnerConfiguration } from '../runner'
import type { RunnableModule } from './types'

export async function resolveRunnableModule (name: string, configuration: RunnerConfiguration, directoryPath?: string): Promise<RunnableModule | undefined> {
  const moduleDirectoryPath: string = directoryPath !== undefined ? directoryPath : configuration.directory
  const dirents: Dirent[] = await fs.readdir(moduleDirectoryPath, { withFileTypes: true })

  for (const dirent of dirents) {
    if (parse(dirent.name).name === name) {
      const module: RunnableModule | NodeModule | undefined = requireModule(resolve(moduleDirectoryPath, name), configuration.options?.debug)

      if (isValidRunnableModule(module)) return module as RunnableModule
    }
  }

  const subdirectories: Dirent[] = dirents.filter((dirent: Dirent): boolean => dirent.isDirectory())

  for (const subdirectory of subdirectories) {
    const resolvedModule: RunnableModule | undefined = await resolveRunnableModule(name, configuration, resolve(moduleDirectoryPath, subdirectory.name))

    if (resolvedModule !== undefined) return resolvedModule
  }

  return undefined
}
