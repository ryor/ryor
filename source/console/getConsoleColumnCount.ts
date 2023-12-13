import { DEFAULT_CONSOLE_COLUMN_COUNT } from './constants'

export function getConsoleColumnCount() {
  return process.stdout.columns ?? DEFAULT_CONSOLE_COLUMN_COUNT
}
