import { parse } from 'shell-quote'

export function parseStringRunnable (runnable: string): string[] {
  return parse(runnable, process.env).reduce((entries: string[], entry: any): string[] => {
    if (typeof entry === 'string') return [...entries, entry]

    else if ((entry as { op: string }).op === 'glob') return [...entries, (entry as { pattern: string }).pattern]

    return entries
  }, [])
}
