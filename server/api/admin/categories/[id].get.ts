import { requireAdminSession } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { serializeCategory } from '../../../utils/serializers'
export default defineEventHandler(async (event) => { requireAdminSession(event); const id=getRouterParam(event,'id'); if(!id) throw createError({statusCode:400,statusMessage:'ID inválido.'}); const item=await prisma.category.findUnique({where:{id}}); if(!item) throw createError({statusCode:404,statusMessage:'Categoria não encontrada.'}); return serializeCategory(item) })
