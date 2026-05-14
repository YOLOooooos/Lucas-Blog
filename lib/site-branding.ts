import { getSetting } from '@/lib/db'

export const DEFAULT_SITE_TITLE = '乔木博客'
export const DEFAULT_SITE_OWNER_NAME = '向阳乔木'

export interface SiteBranding {
  siteTitle: string
  siteOwnerName: string
}

function normalizeBrandingValue(value: string | null | undefined, fallback: string): string {
  const normalized = value?.trim()
  return normalized ? normalized : fallback
}

export function resolveSiteBranding(values: {
  siteTitle?: string | null
  siteOwnerName?: string | null
}): SiteBranding {
  return {
    siteTitle: normalizeBrandingValue(values.siteTitle, DEFAULT_SITE_TITLE),
    siteOwnerName: normalizeBrandingValue(values.siteOwnerName, DEFAULT_SITE_OWNER_NAME),
  }
}

export async function getSiteBranding(db?: D1Database | null): Promise<SiteBranding> {
  if (!db) {
    return resolveSiteBranding({})
  }

  try {
    const [siteTitle, siteOwnerName] = await Promise.all([
      getSetting(db, 'site_title'),
      getSetting(db, 'site_owner_name'),
    ])

    return resolveSiteBranding({ siteTitle, siteOwnerName })
  } catch {
    return resolveSiteBranding({})
  }
}
