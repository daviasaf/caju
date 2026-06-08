export function usePublicUrl() {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/+$/, '')

  function toPublicUrl(value?: string | null) {
    const path = value?.trim() || '/og-logo.png'

    if (/^https?:\/\//i.test(path)) return path
    if (path.startsWith('//')) return `https:${path}`

    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
  }

  return {
    ogLogoUrl: toPublicUrl('/og-logo.png'),
    toPublicUrl
  }
}
