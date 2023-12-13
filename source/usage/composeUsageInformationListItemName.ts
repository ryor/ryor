export function composeUsageInformationListItemName(input: string) {
  return input
    .split(/[ -_]+/)
    .map((word: string) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
