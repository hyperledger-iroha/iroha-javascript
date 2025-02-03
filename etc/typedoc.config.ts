/* eslint-disable @typescript-eslint/consistent-type-imports */

import { path } from 'zx'
import * as meta from './meta'
import { resolve } from './util'

export default {
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-frontmatter',
    'typedoc-vitepress-theme',
    'typedoc-plugin-mdn-links',
    'typedoc-plugin-coverage',
  ],
  name: 'API Documentation',
  disableSources: true,
  githubPages: false,
  readme: 'none',
  includeVersion: true,
  entryPoints: meta.PACKAGES_TO_PUBLISH.toList()
    .map((pkg) => path.join(meta.packageRoot(pkg), 'src/lib.ts'))
    .toArray(),

  frontmatterGlobals: { prev: false, next: false },
  indexFormat: 'table',

  out: resolve('docs/api'),
  docsRoot: resolve('docs'),

  coverageOutputType: 'svg',
} satisfies Partial<
  import('typedoc').TypeDocOptions &
    import('typedoc-plugin-markdown').PluginOptions &
    import('typedoc-plugin-frontmatter').PluginOptions & {
      // https://www.typedoc-plugin-markdown.org/plugins/vitepress/options#--docsroot
      docsRoot: string
    } & {
      //  https://github.com/Gerrit0/typedoc-plugin-coverage?tab=readme-ov-file#options
      coverageOutputType: 'svg' | 'json' | 'all'
    }
>
