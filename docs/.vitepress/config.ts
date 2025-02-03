import { DefaultTheme, defineConfig } from 'vitepress'
import TYPEDOC_SIDEBAR from '../api/typedoc-sidebar.json'

function transformSidebarLink(link: string): string {
  return link.replace(/^\/docs(.+)$/, '$1')
}

function transformSidebarItems(sidebar: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return sidebar.map((item) => {
    const copy = { ...item }
    if (copy.link) copy.link = transformSidebarLink(copy.link)
    if (copy.items) copy.items = transformSidebarItems(copy.items)
    return copy
  })
}

export default defineConfig({
  title: 'Iroha JavaScript SDK',
  themeConfig: {
    sidebar: { '/api': transformSidebarItems(TYPEDOC_SIDEBAR) },
    nav: [{ text: 'API', link: '/api/', activeMatch: '^/api' }],
    search: {
      provider: 'local',
    },
  },
})
