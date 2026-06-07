import { prisma } from '../../utils/prisma'
import { serializeCollection } from '../../utils/serializers'
export default defineEventHandler(async () => (await prisma.collection.findMany({ where: { active: true }, orderBy: [{ featured: 'desc' }, { order: 'asc' }, { name: 'asc' }] })).map(serializeCollection))
