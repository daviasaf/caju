import { get } from '@vercel/blob'

function normalizePathname(value: unknown) {
  if (typeof value !== 'string') return ''
  return decodeURIComponent(value).replace(/^\/+/, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const pathname = normalizePathname(getQuery(event).pathname)

  if (!pathname || pathname.includes('..') || !pathname.startsWith('products/')) {
    throw createError({ statusCode: 404, statusMessage: 'Imagem nao encontrada.' })
  }

  try {
    const result = await get(pathname, {
      access: 'private',
      ...(config.blobReadWriteToken ? { token: config.blobReadWriteToken } : {}),
      ...(config.blobStoreId ? { storeId: config.blobStoreId } : {})
    })

    if (!result || result.statusCode !== 200 || !result.stream) {
      throw createError({ statusCode: 404, statusMessage: 'Imagem nao encontrada.' })
    }

    setHeader(event, 'Content-Type', result.blob.contentType || 'image/webp')
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')

    return sendStream(event, result.stream)
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao carregar imagem do Blob.',
      data: {
        message: err?.message ? `Erro ao carregar imagem do Blob: ${err.message}` : 'Erro ao carregar imagem do Blob.'
      }
    })
  }
})
