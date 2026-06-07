import { requireAdminSession } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { serializeProduct } from '../../../utils/serializers'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const products = await prisma.product.findMany({ include: { images: true, category: true, collection: true }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
  return products.map(serializeProduct)
})
