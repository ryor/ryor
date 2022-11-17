import { transformSync } from 'esbuild'

export default {
  process: (source, path) => ({ code: transformSync(source, { format: 'cjs', loader: path.endsWith('.ts') ? 'ts' : 'js' }).code })
}
