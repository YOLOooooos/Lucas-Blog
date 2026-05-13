import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function getAppCloudflareContext() {
  return getCloudflareContext({ async: true })
}

function isWranglerRemoteAuthError(error: unknown) {
  if (!(error instanceof Error)) return false

  return (
    error.message.includes('Failed to start the remote proxy session') ||
    error.message.includes('You must be logged in to use wrangler dev in remote mode')
  )
}

export async function getAppCloudflareEnv() {
  try {
    return (await getAppCloudflareContext()).env
  } catch (error) {
    if (isWranglerRemoteAuthError(error) && process.env.NODE_ENV === 'development') {
      return undefined
    }
    throw error
  }
}
