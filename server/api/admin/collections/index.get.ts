import { requireAdminSession } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { serializeCollection } from '../../../utils/serializers'
export default defineEventHandler(async (event) => { requireAdminSession(event); return (await prisma.collection.findMany({ orderBy: [{ featured: 'desc' }, { order: 'asc' }, { name: 'asc' }] })).map(serializeCollection) })
