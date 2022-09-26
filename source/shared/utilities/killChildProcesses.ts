import psTree from 'ps-tree'
import { promisify } from 'util'
import { killChildProcess } from './killChildProcess'

export async function killChildProcesses(): Promise<void> {
  await Promise.all((await promisify(psTree)(process.pid)).map(({ PID }) => killChildProcess(parseInt(PID))))
}
