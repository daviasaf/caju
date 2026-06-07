import { loginSchema } from '~~/shared/validation'
import { setAdminSession, verifyAdminPassword } from '../../utils/auth'
export default defineEventHandler(async (event) => {
  const body = loginSchema.parse(await readBody(event))
  if (!verifyAdminPassword(body.password)) throw createError({ statusCode: 401, statusMessage: 'Senha inválida.' })
  setAdminSession(event)
  return { ok: true }
})
