export default defineNuxtRouteMiddleware(async () => {
  const { data, error } = await useFetch<{ authenticated: boolean }>('/api/admin/me')
  if (error.value || !data.value?.authenticated) return navigateTo('/admin/login')
})
