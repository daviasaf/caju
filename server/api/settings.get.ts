import { prisma } from '../utils/prisma'
import { serializeSettings } from '../utils/serializers'

export default defineEventHandler(async () => {
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'settings_default' },
    update: {},
    create: {
      id: 'settings_default',
      storeName: 'CAJU',
      whatsappNumber: '5522999999999',
      instagram: 'https://instagram.com/vistacaju',
      city: 'Quissama',
      state: 'RJ',
      heroTitle: 'Vista Quissama.',
      heroSubtitle: 'Produtos com alma local, feitos para circular pelo Brasil.',
      paymentText: 'Pix, cartao e dinheiro.',
      shippingText: 'Envio para todo o Brasil.'
    }
  })

  return serializeSettings(settings)
})
