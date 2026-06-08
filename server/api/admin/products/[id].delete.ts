import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID invalido.' })
  const product = await prisma.$transaction(async (tx) => {
    const deleted = await tx.product.delete({ where: { id } })

    await tx.storeSettings.updateMany({
      where: { featuredProductId: id },
      data: { featuredProductId: null }
    })

    return deleted
  })
  await createAdminLog('delete', 'product', product.name)
  return { ok: true }
})
