export async function wait(duration: number) {
  return await new Promise<void>((resolve: () => void) => {
    setTimeout(resolve, duration)
  })
}
