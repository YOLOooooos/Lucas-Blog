import { normalizeTheme, type Theme } from '@/lib/appearance'
import { getPublicCategories, getSetting } from '@/lib/db'
import { DEFAULT_SITE_OWNER_NAME, DEFAULT_SITE_TITLE, getSiteBranding } from '@/lib/site-branding'

export interface SiteNavLink {
  label: string
  url: string
  openInNewTab: boolean
}

export interface SiteCategoryLink {
  name: string
  slug: string
}

export async function getSiteHeaderData(db: D1Database): Promise<{
  navLinks: SiteNavLink[]
  categories: SiteCategoryLink[]
  defaultTheme: Theme
  siteTitle: string
  siteOwnerName: string
}> {
  let navLinks: SiteNavLink[] = []
  let categories: SiteCategoryLink[] = []
  let defaultTheme: Theme = 'default'
  let siteTitle = DEFAULT_SITE_TITLE
  let siteOwnerName = DEFAULT_SITE_OWNER_NAME

  try {
    const [navJson, categoryRows, themeValue, branding] = await Promise.all([
      getSetting(db, 'nav_links'),
      getPublicCategories(db),
      getSetting(db, 'default_theme'),
      getSiteBranding(db),
    ])

    if (navJson) {
      try {
        const parsed = JSON.parse(navJson)
        if (Array.isArray(parsed)) {
          navLinks = parsed
        }
      } catch {}
    }

    categories = categoryRows
      .filter((category) => category.slug && category.name && category.name !== '未分类')
      .map((category) => ({
        name: category.name,
        slug: category.slug,
      }))

    defaultTheme = normalizeTheme(themeValue)
    siteTitle = branding.siteTitle
    siteOwnerName = branding.siteOwnerName
  } catch {
    // Keep graceful fallback behavior for public pages
  }

  return { navLinks, categories, defaultTheme, siteTitle, siteOwnerName }
}
