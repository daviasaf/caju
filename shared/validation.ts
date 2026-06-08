import { z } from 'zod'

const money = z.preprocess(
  (value) => typeof value === 'string' ? Number(value.replace(',', '.')) : value,
  z.number({ invalid_type_error: 'Informe um valor válido.' }).min(0, 'O preço não pode ser negativo.')
)

const optionalMoney = z.preprocess(
  (value) => value === '' || value === null || value === undefined ? null : typeof value === 'string' ? Number(value.replace(',', '.')) : value,
  z.number({ invalid_type_error: 'Informe um valor válido.' }).min(0, 'O preço não pode ser negativo.').nullable().optional()
)

const optNum = z.preprocess(
  (value) => value === '' || value === null || value === undefined ? null : Number(value),
  z.number({ invalid_type_error: 'Informe um número válido.' }).int().min(0).nullable().optional()
)

const order = z.preprocess(
  (value) => value === '' || value === null || value === undefined ? 0 : Number(value),
  z.number().int().default(0)
)

const optionalText = z.string().optional().nullable()
const stringList = z.array(z.string().trim().min(1)).default([])
const productImageInput = z.union([
  z.string().trim().min(1).transform((url) => ({ url, color: null as string | null })),
  z.object({
    url: z.string().trim().min(1),
    color: optionalText
  }).transform((image) => ({ url: image.url, color: image.color?.trim() || null }))
])

export const loginSchema = z.object({
  password: z.string().min(1, 'Digite a senha do admin.')
})

export const productSchema = z.object({
  name: z.string().min(2, 'Informe o nome do produto.'),
  slug: optionalText,
  shortDescription: optionalText,
  description: optionalText,
  price: money,
  promotionalPrice: optionalMoney,
  categoryId: optionalText,
  collectionId: optionalText,
  images: z.array(productImageInput).default([]),
  sizes: stringList,
  colors: stringList,
  materials: stringList,
  tags: stringList,
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  stock: optNum,
  order,
  seoTitle: optionalText,
  seoDescription: optionalText
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Informe o nome da categoria.'),
  slug: optionalText,
  description: optionalText,
  color: optionalText,
  icon: optionalText,
  active: z.boolean().default(true),
  order
})

export const collectionSchema = z.object({
  name: z.string().min(2, 'Informe o nome da coleção.'),
  slug: optionalText,
  description: optionalText,
  image: optionalText,
  highlightColor: optionalText,
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  order
})

export const settingsSchema = z.object({
  storeName: z.string().min(2, 'Informe o nome da loja.'),
  whatsappNumber: z.string().min(10, 'Informe o WhatsApp com DDD.'),
  instagram: optionalText,
  city: optionalText,
  state: optionalText,
  heroTitle: optionalText,
  heroSubtitle: optionalText,
  heroImage: optionalText,
  featuredProductId: optionalText,
  featuredCollectionId: optionalText,
  paymentText: optionalText,
  shippingText: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText
})
