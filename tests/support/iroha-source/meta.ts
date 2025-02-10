import path from 'node:path'
import url from 'node:url'

const dirname = url.fileURLToPath(new url.URL('.', import.meta.url))

export const IROHA_DIR = path.join(dirname, '../../../.iroha')
