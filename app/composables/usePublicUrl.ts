export function usePublicUrl() {
  const config = useRuntimeConfig()
  const configuredSiteUrl = String(config.public.siteUrl || 'http://localhost:3000').trim()
  const siteUrl = normalizeSiteUrl(configuredSiteUrl)

  function toPublicUrl(value?: string | null) {
    const path = value?.trim() || '/og-caju.png'

    if (/^https?:\/\//i.test(path)) return path
    if (path.startsWith('//')) return `https:${path}`

    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  return {
    ogLogoUrl: toPublicUrl('/og-caju.png'),
    toPublicUrl
  }
}

function normalizeSiteUrl(value: string) {
  const url = value || 'http://localhost:3000'

  if (/^https?:\/\//i.test(url)) return url.replace(/\/+$/, '')
  if (/^(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/i.test(url)) return `http://${url}`.replace(/\/+$/, '')

  return `https://${url}`.replace(/\/+$/, '')
}
