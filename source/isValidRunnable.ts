export function isValidRunnable (value:any):boolean {
  return ((typeof value === 'string' && value !== '') || typeof value === 'function')
}
