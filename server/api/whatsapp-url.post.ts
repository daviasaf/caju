import { createWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'settings_default' } })

  const msg = createWhatsAppMessage({
    productName: String(body.productName || ''),
    size: body.size ? String(body.size) : undefined,
    color: body.color ? String(body.color) : undefined,
    quantity: Number(body.quantity || 1),
    price: Number(body.price || 0),
    url: String(body.url || '')
  })

  return {
    url: createWhatsAppUrl(settings?.whatsappNumber || '5522999999999', msg),
    message: msg
  }
})
