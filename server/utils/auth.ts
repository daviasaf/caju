import type { H3Event } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'caju_admin_session'
const ONE_DAY = 60 * 60 * 24

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)

  if (ab.length !== bb.length) return false

  return timingSafeEqual(ab, bb)
}

export function verifyAdminPassword(password: string) {
  const config = useRuntimeConfig()

  if (!config.adminPassword) {
    throw createError({ statusCode: 500, statusMessage: 'ADMIN_PASSWORD não está configurada.' })
  }

  return safeEqual(password, config.adminPassword)
}

export function setAdminSession(event: H3Event) {
  const config = useRuntimeConfig()
  const payload = JSON.stringify({ role: 'admin', exp: Math.floor(Date.now() / 1000) + ONE_DAY })
  const token = `${Buffer.from(payload).toString('base64url')}.${sign(payload, config.sessionSecret)}`

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_DAY
  })
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export function getAdminSession(event: H3Event) {
  const config = useRuntimeConfig()
  const token = getCookie(event, COOKIE_NAME)

  if (!token) return null

  try {
    const [payloadBase64, signature] = token.split('.')
    if (!payloadBase64 || !signature) return null

    const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8')
    const expected = sign(payload, config.sessionSecret)

    if (!safeEqual(signature, expected)) return null

    const data = JSON.parse(payload) as { role: string, exp: number }

    if (data.role !== 'admin') return null
    if (data.exp < Math.floor(Date.now() / 1000)) return null

    return data
  } catch {
    return null
  }
}

export function requireAdminSession(event: H3Event) {
  const session = getAdminSession(event)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Sessão admin inválida ou expirada.' })
  }

  return session
}
