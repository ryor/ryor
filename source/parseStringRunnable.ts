import { parse } from 'shell-quote'

export function parseStringRunnable (runnable:string):string[] {
  return parse(runnable, process.env).reduce((entries:string[], entry:any):string[] => {
    if (typeof entry === 'string') return [...entries, entry]

    else if ((<{ op:string }>entry).op === 'glob') return [...entries, (<{ pattern: string }>entry).pattern]

    return entries
  }, [])
}
