import { categorySchema } from '~~/shared/validation'
import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
import { serializeCategory } from '../../../utils/serializers'
import { createSlug, uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const data = categorySchema.parse(await readBody(event))
  const baseSlug = createSlug(data.slug || data.name)
  const slug = await uniqueSlug(baseSlug || data.name, async (candidate) => Boolean(await prisma.category.findUnique({ where: { slug: candidate } })))
  const item = await prisma.category.create({ data: { ...data, slug } })

  await createAdminLog('create', 'category', item.name)

  return serializeCategory(item)
})
