import { getAdminSession } from '../../utils/auth'
export default defineEventHandler((event) => ({ authenticated: Boolean(getAdminSession(event)) }))
