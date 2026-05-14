import { getAppCloudflareEnv } from '@/lib/cloudflare'
import { DEFAULT_SITE_TITLE, getSiteBranding } from '@/lib/site-branding'
import { AdminLoginForm } from './AdminLoginForm'

export default async function AdminLoginPage() {
  let siteTitle = DEFAULT_SITE_TITLE

  try {
    const env = await getAppCloudflareEnv()
    if (env?.DB) {
      siteTitle = (await getSiteBranding(env.DB)).siteTitle
    }
  } catch {}

  return <AdminLoginForm siteTitle={siteTitle} />
}
