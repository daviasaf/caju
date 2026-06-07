import { prisma } from '../../utils/prisma'
import { serializeCategory } from '../../utils/serializers'
export default defineEventHandler(async () => (await prisma.category.findMany({ where: { active: true }, orderBy: [{ order: 'asc' }, { name: 'asc' }] })).map(serializeCategory))
