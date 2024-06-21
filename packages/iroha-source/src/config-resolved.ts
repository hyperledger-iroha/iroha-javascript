import { P, match } from 'ts-pattern'
import type { ResolvedConfig } from './types'
import CFG from '../config'
import path from 'path'
import url from 'url'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

const resolved: ResolvedConfig = match(CFG)
  .with(
    { path: P.string },
    (cfgPath): ResolvedConfig => ({
      t: 'path',
      absolutePath: path.resolve(dirname, '../', cfgPath.path),
    }),
  )
  .with({ origin: P.string }, (cfgGitClone): ResolvedConfig => ({ t: 'git-clone', ...cfgGitClone }))
  .exhaustive()

export default resolved
