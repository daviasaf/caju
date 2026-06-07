import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { put } from '@vercel/blob'
import sharp from 'sharp'
import { requireAdminSession } from '../../utils/auth'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

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

  const uploadProvider = config.uploadProvider === 'blob' ? 'vercel-blob' : config.uploadProvider

  if (uploadProvider === 'vercel-blob') {
    if (!config.blobReadWriteToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'BLOB_READ_WRITE_TOKEN nao configurado. BLOB_STORE_ID e BLOB_WEBHOOK_PUBLIC_KEY nao substituem o token de escrita.'
      })
    }

    const blob = await put(filename, optimized, {
      access: 'public',
      contentType: 'image/webp',
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      token: config.blobReadWriteToken
    })

    return { url: blob.url }
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
