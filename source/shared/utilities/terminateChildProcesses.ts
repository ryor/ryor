import psTree from 'ps-tree'
import { promisify } from 'util'
import { terminateChildProcess } from './terminateChildProcess'

export async function terminateChildProcesses (): Promise<void> {
  await Promise.all((await promisify(psTree)(process.pid)).map(({ PID }) => terminateChildProcess(parseInt(PID))))
}
