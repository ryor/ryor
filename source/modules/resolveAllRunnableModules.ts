import glob from 'fast-glob'
import { normalize, parse } from 'path'
import { RunnerConfiguration } from '../runner'
import { importModule } from './importModule'
import { isValidRunnableModule } from './isValidRunnableModule'
import type { RunnableModule } from './types'

export async function resolveAllRunnableModules({ directory, options, usage }: RunnerConfiguration): Promise<Map<string, Map<string, RunnableModule>>> {
  const debug = !!options?.debug
  const jsFilePaths = await glob('**/*.js', {
    absolute: true,
    cwd: directory,
    ignore: (usage?.ignore && typeof usage.ignore === 'string' ? [usage.ignore] : usage?.ignore) as string[] | undefined
  })
  const modules = new Map<string, Map<string, RunnableModule>>()

  if (jsFilePaths.length > 0) {
    await Promise.all(
      jsFilePaths.map(async (path) => {
        const module: NodeModule | undefined = await importModule(path, debug)

        if (module !== undefined && isValidRunnableModule(module)) {
          const { dir, name } = parse(path)
          const moduleName = name === 'index' ? parse(dir).name : name
          const moduleDirectoryPath = name === 'index' ? parse(dir).dir : dir

          if (normalize(directory) === normalize(moduleDirectoryPath)) {
            if (!modules.has('untyped')) modules.set('untyped', new Map())
            modules.get('untyped')?.set(moduleName, module as RunnableModule)
          } else {
            const moduleType = parse(moduleDirectoryPath).name

            if (!modules.has(moduleType)) modules.set(moduleType, new Map())
            modules.get(moduleType)?.set(moduleName, module as RunnableModule)
          }
        }
      })
    )
  }

  for (const [type, map] of modules.entries()) modules.set(type, new Map([...map.entries()].sort(([key1], [key2]) => (key1 > key2 ? 1 : -1))))

  return modules
}
