import path from 'path'
import url from 'url'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const IROHA_DIR = path.join(dirname, '../.iroha')
