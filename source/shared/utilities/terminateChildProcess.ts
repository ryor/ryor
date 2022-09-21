import { SIGTERM } from 'constants'
import { wait } from './wait'

const POLLING_DELAY: number = 250

export async function terminateChildProcess (pid: number): Promise<void> {
  let processTerminated = false

  process.kill(pid, SIGTERM)

  while (!processTerminated) {
    try {
      process.kill(pid, 0)
    } catch (error) {
      processTerminated = true
    }

    if (!processTerminated) await wait(POLLING_DELAY)
  }
}
