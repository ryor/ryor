import psTree from 'ps-tree'
import { promisify } from 'util'
import { wait } from './wait'
import type { PS } from 'ps-tree'

const KILL_SIGNAL: string = 'SIGTERM'

const WAIT_DURATION: number = 200

export async function killChildProcesses (pid: number): Promise<void> {
  const psTreePromise: (pid: number) => Promise<readonly PS[]> = promisify(psTree)
  let activeChildProcessIDs: number[] = (await psTreePromise(pid)).map(({ PID }): number => parseInt(PID))

  while (activeChildProcessIDs.length > 0) {
    activeChildProcessIDs = activeChildProcessIDs.filter(pid => {
      try {
        process.kill(pid, KILL_SIGNAL)
        return false
      } catch (error) {
        return true
      }
    })

    if (activeChildProcessIDs.length > 0) await wait(WAIT_DURATION)
  }
}
