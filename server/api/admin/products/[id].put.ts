import { productSchema } from '~~/shared/validation'
import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
import { serializeProduct } from '../../../utils/serializers'
import { createSlug } from '../../../utils/slug'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
  const data = productSchema.parse(await readBody(event))
  const slug = createSlug(data.slug || data.name)
  if (await prisma.product.findFirst({ where: { slug, id: { not: id } } })) throw createError({ statusCode: 409, statusMessage: 'Já existe um produto com esse slug.' })
  const product = await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } })
    return tx.product.update({
      where: { id },
      data: { ...data, slug, categoryId: data.categoryId || null, collectionId: data.collectionId || null, images: { create: data.images.map((url, order) => ({ url, alt: data.name, order })) } },
      include: { images: true, category: true, collection: true }
    })
  })
  await createAdminLog('update', 'product', product.name)
  return serializeProduct(product)
})
