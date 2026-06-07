import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
export default defineEventHandler(async (event) => { requireAdminSession(event); const id=getRouterParam(event,'id'); if(!id) throw createError({statusCode:400,statusMessage:'ID inválido.'}); const item=await prisma.collection.delete({where:{id}}); await createAdminLog('delete','collection',item.name); return { ok:true } })
