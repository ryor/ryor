import { existsSync } from 'fs'
import { resolve } from 'path'

const DEFAULT_DIVIDER:string = ':'

const WINDOWS_DIVIDER:string = ';'

const WINDOWS_IDENTIFIER:string = 'win32'

export function ensureCorrectPathValue ():void {
  const binDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')

  if (existsSync(binDirectoryPath)) {
    const PATH:string = process.env.PATH!

    if (!PATH.includes(binDirectoryPath)) process.env.PATH += (process.platform === WINDOWS_IDENTIFIER ? WINDOWS_DIVIDER : DEFAULT_DIVIDER) + binDirectoryPath
  }
}
