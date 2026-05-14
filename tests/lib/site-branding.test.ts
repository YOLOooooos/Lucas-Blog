import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getSetting: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  getSetting: mocks.getSetting,
}))

import {
  DEFAULT_SITE_OWNER_NAME,
  DEFAULT_SITE_TITLE,
  getSiteBranding,
  resolveSiteBranding,
} from '@/lib/site-branding'

describe('site-branding helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('falls back to default branding when settings are missing or blank', () => {
    expect(resolveSiteBranding({ siteTitle: null, siteOwnerName: '   ' })).toEqual({
      siteTitle: DEFAULT_SITE_TITLE,
      siteOwnerName: DEFAULT_SITE_OWNER_NAME,
    })
  })

  it('trims configured branding values', () => {
    expect(
      resolveSiteBranding({
        siteTitle: '  Lucas Blog  ',
        siteOwnerName: '  Lucas  ',
      }),
    ).toEqual({
      siteTitle: 'Lucas Blog',
      siteOwnerName: 'Lucas',
    })
  })

  it('loads branding from site settings', async () => {
    mocks.getSetting
      .mockResolvedValueOnce('我的博客')
      .mockResolvedValueOnce('木木')

    await expect(getSiteBranding({ kind: 'db' } as never)).resolves.toEqual({
      siteTitle: '我的博客',
      siteOwnerName: '木木',
    })

    expect(mocks.getSetting).toHaveBeenNthCalledWith(1, { kind: 'db' }, 'site_title')
    expect(mocks.getSetting).toHaveBeenNthCalledWith(2, { kind: 'db' }, 'site_owner_name')
  })

  it('returns defaults when reading settings fails', async () => {
    mocks.getSetting.mockRejectedValue(new Error('boom'))

    await expect(getSiteBranding({ kind: 'db' } as never)).resolves.toEqual({
      siteTitle: DEFAULT_SITE_TITLE,
      siteOwnerName: DEFAULT_SITE_OWNER_NAME,
    })
  })
})
