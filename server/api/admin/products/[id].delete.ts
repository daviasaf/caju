import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
  const product = await prisma.product.delete({ where: { id } })
  await createAdminLog('delete', 'product', product.name)
  return { ok: true }
})
