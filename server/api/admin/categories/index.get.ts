import { requireAdminSession } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { serializeCategory } from '../../../utils/serializers'
export default defineEventHandler(async (event) => { requireAdminSession(event); return (await prisma.category.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] })).map(serializeCategory) })
