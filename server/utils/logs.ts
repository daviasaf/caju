import { prisma } from './prisma'
export async function createAdminLog(action: string, entity: string, title: string, detail?: string) {
  await prisma.adminLog.create({ data: { action, entity, title, detail } })
}
