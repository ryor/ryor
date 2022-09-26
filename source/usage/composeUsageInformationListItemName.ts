export function composeUsageInformationListItemName(input: string): string {
  return input
    .split(/[ -_]+/)
    .map((word: string): string => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
