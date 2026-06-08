import { requireAdminSession } from '../../../../utils/auth'
import { createAdminLog } from '../../../../utils/logs'
import { prisma } from '../../../../utils/prisma'
import { serializeProduct } from '../../../../utils/serializers'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID invalido.' })

  const product = await prisma.$transaction(async (tx) => {
    const current = await tx.product.findUnique({ where: { id } })
    if (!current) throw createError({ statusCode: 404, statusMessage: 'Produto nao encontrado.' })
    if (!current.active) throw createError({ statusCode: 400, statusMessage: 'Ative o produto antes de destacar.' })

    await tx.product.updateMany({ data: { featured: false } })

    const updated = await tx.product.update({
      where: { id },
      data: { featured: true },
      include: { images: true, category: true, collection: true }
    })

    await tx.storeSettings.upsert({
      where: { id: 'settings_default' },
      create: {
        id: 'settings_default',
        storeName: 'CAJU',
        whatsappNumber: '5522999999999',
        featuredProductId: id
      },
      update: { featuredProductId: id }
    })

    return updated
  })

  await createAdminLog('feature', 'product', product.name)

  return serializeProduct(product)
})
