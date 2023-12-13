import cliTruncate from 'cli-truncate'
import { LINE_BREAK } from '../shared'

export function truncateConsoleOutput(text: string, columns: number) {
  return text
    .split(LINE_BREAK)
    .map((line) => cliTruncate(line, columns))
    .join(LINE_BREAK)
}
