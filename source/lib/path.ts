import { existsSync } from 'fs'
import { resolve } from 'path'

export function ensureCorrectPathValue ():void {
  const env:{[key:string]:string} = process.env as {[key:string]:string}
  const binDirectoryPath:string = resolve(process.cwd(), 'node_modules/.bin')

  if (existsSync(binDirectoryPath) && !env.PATH.includes(binDirectoryPath)) { env.PATH = `${env.PATH}${process.platform === 'win32' ? ';' : ':'}${binDirectoryPath}` }
}
