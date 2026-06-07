import { prisma } from '../../utils/prisma'
import { serializeCollection, serializeProduct } from '../../utils/serializers'
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug inválido.' })
  const collection = await prisma.collection.findFirst({ where: { slug, active: true } })
  if (!collection) throw createError({ statusCode: 404, statusMessage: 'Coleção não encontrada.' })
  const products = await prisma.product.findMany({ where: { collectionId: collection.id, active: true }, include: { images: true, category: true, collection: true }, orderBy: [{ featured: 'desc' }, { order: 'asc' }] })
  return { collection: serializeCollection(collection), products: products.map(serializeProduct) }
})
