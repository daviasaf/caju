import { collectionSchema } from '~~/shared/validation'
import { requireAdminSession } from '../../../utils/auth'
import { createAdminLog } from '../../../utils/logs'
import { prisma } from '../../../utils/prisma'
import { serializeCollection } from '../../../utils/serializers'
import { createSlug } from '../../../utils/slug'
export default defineEventHandler(async (event) => { requireAdminSession(event); const id=getRouterParam(event,'id'); if(!id) throw createError({statusCode:400,statusMessage:'ID inválido.'}); const data=collectionSchema.parse(await readBody(event)); const slug=createSlug(data.slug||data.name); if(await prisma.collection.findFirst({where:{slug,id:{not:id}}})) throw createError({statusCode:409,statusMessage:'Slug já existe.'}); if(data.featured) await prisma.collection.updateMany({where:{id:{not:id}},data:{featured:false}}); const item=await prisma.collection.update({where:{id},data:{...data,slug}}); await createAdminLog('update','collection',item.name); return serializeCollection(item) })
