import { SIGTERM } from 'constants'
import { wait } from './wait'

const POLLING_DELAY: number = 250

export async function terminateChildProcess (pid: number): Promise<void> {
  let processTerminated = false

  try {
    process.kill(pid, SIGTERM)
  } catch(error) {}

  while (!processTerminated) {
    try {
      process.kill(pid, 0)
    } catch (error) {
      processTerminated = true
    }

    if (!processTerminated) await wait(POLLING_DELAY)
  }
}
