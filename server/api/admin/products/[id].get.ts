import { requireAdminSession } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { serializeProduct } from '../../../utils/serializers'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true, category: true, collection: true } })
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado.' })
  return serializeProduct(product)
})
