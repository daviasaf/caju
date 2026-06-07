import { prisma } from '../../utils/prisma'
import { serializeProduct } from '../../utils/serializers'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const and: any[] = [{ active: true }]
  if (q.search) {
    const search = String(q.search)
    and.push({ OR: [{ name: { contains: search, mode: 'insensitive' } }, { shortDescription: { contains: search, mode: 'insensitive' } }] })
  }
  if (q.product) and.push({ slug: String(q.product) })
  if (q.category) and.push({ category: { slug: String(q.category) } })
  if (q.collection) and.push({ collection: { slug: String(q.collection) } })
  if (q.size) and.push({ sizes: { has: String(q.size) } })
  if (q.color) and.push({ colors: { has: String(q.color) } })
  if (q.available === 'available') and.push({ OR: [{ stock: null }, { stock: { gt: 0 } }] })
  const sort = String(q.sort || 'recentes')
  const orderBy = sort === 'menor-preco' ? { price: 'asc' as const } : sort === 'maior-preco' ? { price: 'desc' as const } : sort === 'destaques' ? [{ featured: 'desc' as const }, { order: 'asc' as const }] : [{ order: 'asc' as const }, { createdAt: 'desc' as const }]
  const products = await prisma.product.findMany({ where: { AND: and }, include: { images: true, category: true, collection: true }, orderBy })
  return products.map(serializeProduct)
})
