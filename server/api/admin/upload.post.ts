import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { put } from '@vercel/blob'
import sharp from 'sharp'
import { requireAdminSession } from '../../utils/auth'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024
type BlobAccess = 'public' | 'private'

function resolveUploadProvider(config: ReturnType<typeof useRuntimeConfig>) {
  const provider = config.uploadProvider === 'blob' ? 'vercel-blob' : config.uploadProvider

  if (
    provider === 'local'
    && process.env.VERCEL
    && (config.blobStoreId || config.blobReadWriteToken)
  ) {
    return 'vercel-blob'
  }

  return provider
}

function getBlobPathname(blob: { pathname?: string, url: string }) {
  if (blob.pathname) return blob.pathname

  try {
    return new URL(blob.url).pathname.replace(/^\/+/, '')
  } catch {
    return ''
  }
}

function getImageUrl(blob: { pathname?: string, url: string }, access: BlobAccess) {
  if (access === 'private') {
    const pathname = getBlobPathname(blob)
    return `/api/blob?pathname=${encodeURIComponent(pathname)}`
  }

  return blob.url
}

function getBlobOptions(config: ReturnType<typeof useRuntimeConfig>) {
  return {
    contentType: 'image/webp',
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    ...(config.blobReadWriteToken ? { token: config.blobReadWriteToken } : {}),
    ...(config.blobStoreId ? { storeId: config.blobStoreId } : {})
  }
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const config = useRuntimeConfig()
  const form = await readMultipartFormData(event)
  const file = form?.find((item) => item.name === 'file')

  if (!file?.data || !file.type) {
    throw createError({ statusCode: 400, statusMessage: 'Arquivo não enviado.' })
  }

  if (!ALLOWED.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Use JPG, PNG ou WebP.' })
  }

  if (file.data.byteLength > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'Máximo de 5MB.' })
  }

  const optimized = await sharp(file.data)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()

  const filename = `products/${Date.now()}-${randomUUID()}.webp`

  const uploadProvider = resolveUploadProvider(config)

  if (uploadProvider === 'vercel-blob') {
    const preferredAccess: BlobAccess = config.blobAccess === 'private' ? 'private' : 'public'
    const accessAttempts: BlobAccess[] = preferredAccess === 'private' ? ['private'] : ['public', 'private']
    let lastError: any

    for (const access of accessAttempts) {
      try {
        const blob = await put(filename, optimized, {
          access,
          ...getBlobOptions(config)
        })

        return { url: getImageUrl(blob, access) }
      } catch (err: any) {
        lastError = err
      }
    }

    try {
      throw lastError
    } catch (err: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erro ao salvar imagem no Blob. Confira se o Blob Store esta conectado ao projeto na Vercel.',
        data: {
          message: err?.message
            ? `Erro ao salvar imagem no Blob: ${err.message}`
            : 'Erro ao salvar imagem no Blob. Confira se o Blob Store esta conectado ao projeto na Vercel.'
        }
      })
    }
  }

  if (uploadProvider !== 'local') {
    throw createError({ statusCode: 400, statusMessage: `UPLOAD_PROVIDER invalido: ${config.uploadProvider}. Use local, blob ou vercel-blob.` })
  }

  const dir = join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(dir, { recursive: true })

  const localName = filename.split('/').pop()!
  await writeFile(join(dir, localName), optimized)

  return { url: `/uploads/products/${localName}` }
})
