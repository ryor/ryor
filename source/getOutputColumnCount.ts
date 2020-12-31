const DEFAULT_OUTPUT_COLUMN_COUNT: number = 100

export function getOutputColumnCount (): number {
  return process.stdout.columns ?? DEFAULT_OUTPUT_COLUMN_COUNT
}
