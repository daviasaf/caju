import { settingsSchema } from '~~/shared/validation'
import { requireAdminSession } from '../../utils/auth'
import { createAdminLog } from '../../utils/logs'
import { prisma } from '../../utils/prisma'
import { serializeSettings } from '../../utils/serializers'
export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const data = settingsSchema.parse(await readBody(event))
  const settings = await prisma.storeSettings.upsert({ where: { id: 'settings_default' }, create: { id: 'settings_default', ...data }, update: data })
  await createAdminLog('update', 'settings', 'Configurações da loja')
  return serializeSettings(settings)
})
