const PRIVATE_BLOB_HOST = '.private.blob.vercel-storage.com'

export function toPrivateBlobProxyUrl(url: string | null | undefined) {
  if (!url) return url

  try {
    const parsed = new URL(url)

    if (!parsed.hostname.endsWith(PRIVATE_BLOB_HOST)) return url

    const pathname = parsed.pathname.replace(/^\/+/, '')
    if (!pathname) return url

    return `/api/blob?pathname=${encodeURIComponent(pathname)}`
  } catch {
    return url
  }
}

