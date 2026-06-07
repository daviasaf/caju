import { categorySchema } from '~~/shared/validation'
import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
import { serializeCategory } from '../../../utils/serializers'
import { createSlug } from '../../../utils/slug'
export default defineEventHandler(async (event) => { requireAdminSession(event); const id=getRouterParam(event,'id'); if(!id) throw createError({statusCode:400,statusMessage:'ID inválido.'}); const data=categorySchema.parse(await readBody(event)); const slug=createSlug(data.slug||data.name); if(await prisma.category.findFirst({where:{slug,id:{not:id}}})) throw createError({statusCode:409,statusMessage:'Slug já existe.'}); const item=await prisma.category.update({where:{id},data:{...data,slug}}); await createAdminLog('update','category',item.name); return serializeCategory(item) })
