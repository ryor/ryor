import cliTruncate from 'cli-truncate'
import { LINE_BREAK } from '../shared'

export function truncateConsoleOutput (text: string, columns: number): string {
  return text.split(LINE_BREAK).map((line: string): string => cliTruncate(line, columns)).join(LINE_BREAK)
}
