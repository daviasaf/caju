import { requireAdminSession } from '../../utils/auth'
import { prisma } from '../../utils/prisma'
import { serializeProduct } from '../../utils/serializers'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const [totalProducts, activeProducts, inactiveProducts, categories, collections, featuredProducts, latestProducts] = await Promise.all([
    prisma.product.count(), prisma.product.count({ where: { active: true } }), prisma.product.count({ where: { active: false } }), prisma.category.count(), prisma.collection.count(), prisma.product.count({ where: { featured: true } }),
    prisma.product.findMany({ include: { images: true, category: true, collection: true }, orderBy: { createdAt: 'desc' }, take: 5 })
  ])
  return { totalProducts, activeProducts, inactiveProducts, categories, collections, featuredProducts, latestProducts: latestProducts.map(serializeProduct) }
})
