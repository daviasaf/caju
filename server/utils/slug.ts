export function createSlug(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}
export async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>) {
  const raw = createSlug(base) || 'item'
  let slug = raw
  let count = 2
  while (await exists(slug)) { slug = `${raw}-${count}`; count++ }
  return slug
}
