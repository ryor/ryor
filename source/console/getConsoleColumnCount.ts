import { DEFAULT_CONSOLE_COLUMN_COUNT } from './constants'

export function getConsoleColumnCount (): number {
  return process.stdout.columns ?? DEFAULT_CONSOLE_COLUMN_COUNT
}
