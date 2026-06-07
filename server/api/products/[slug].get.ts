import { prisma } from '../../utils/prisma'
import { serializeProduct } from '../../utils/serializers'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug inválido.' })
  const product = await prisma.product.findFirst({ where: { slug, active: true }, include: { images: true, category: true, collection: true } })
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado.' })
  const or = []
  if (product.categoryId) or.push({ categoryId: product.categoryId })
  if (product.collectionId) or.push({ collectionId: product.collectionId })
  const related = await prisma.product.findMany({ where: { active: true, id: { not: product.id }, ...(or.length ? { OR: or } : {}) }, include: { images: true, category: true, collection: true }, take: 4, orderBy: [{ featured: 'desc' }, { order: 'asc' }] })
  return { product: serializeProduct(product), related: related.map(serializeProduct) }
})
