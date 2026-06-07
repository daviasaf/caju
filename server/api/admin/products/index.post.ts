import { productSchema } from '~~/shared/validation'
import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
import { serializeProduct } from '../../../utils/serializers'
import { createSlug, uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const data = productSchema.parse(await readBody(event))
  const baseSlug = createSlug(data.slug || data.name)
  const slug = await uniqueSlug(baseSlug || data.name, async (candidate) => Boolean(await prisma.product.findUnique({ where: { slug: candidate } })))

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      categoryId: data.categoryId || null,
      collectionId: data.collectionId || null,
      images: { create: data.images.map((url, order) => ({ url, alt: data.name, order })) }
    },
    include: { images: true, category: true, collection: true }
  })

  await createAdminLog('create', 'product', product.name)

  return serializeProduct(product)
})
