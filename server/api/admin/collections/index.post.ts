import { collectionSchema } from '~~/shared/validation'
import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
import { serializeCollection } from '../../../utils/serializers'
import { createSlug, uniqueSlug } from '../../../utils/slug'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const data = collectionSchema.parse(await readBody(event))
  const baseSlug = createSlug(data.slug || data.name)
  const slug = await uniqueSlug(baseSlug || data.name, async (candidate) => Boolean(await prisma.collection.findUnique({ where: { slug: candidate } })))

  if (data.featured) await prisma.collection.updateMany({ data: { featured: false } })

  const item = await prisma.collection.create({ data: { ...data, slug } })

  await createAdminLog('create', 'collection', item.name)

  return serializeCollection(item)
})
