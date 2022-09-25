export async function wait(duration: number): Promise<void> {
  return await new Promise<void>((resolve: () => void): void => {
    setTimeout(resolve, duration)
  })
}
