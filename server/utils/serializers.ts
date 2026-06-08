import type { Product, ProductImage, Category, Collection, StoreSettings } from '@prisma/client'
import { toPrivateBlobProxyUrl } from './blob-images'

type ProductWithRelations = Product & { images: ProductImage[]; category?: Category | null; collection?: Collection | null }
const money = (v: unknown) => v == null ? null : Number(v)
export function serializeCategory(category: Category) { return { ...category, createdAt: category.createdAt.toISOString(), updatedAt: category.updatedAt.toISOString() } }
export function serializeCollection(collection: Collection) { return { ...collection, image: toPrivateBlobProxyUrl(collection.image), createdAt: collection.createdAt.toISOString(), updatedAt: collection.updatedAt.toISOString() } }
export function serializeProduct(product: ProductWithRelations) {
  return { ...product, price: Number(product.price), promotionalPrice: money(product.promotionalPrice), createdAt: product.createdAt.toISOString(), updatedAt: product.updatedAt.toISOString(), images: product.images.sort((a,b)=>a.order-b.order).map(i=>({ ...i, url: toPrivateBlobProxyUrl(i.url) || i.url, createdAt: i.createdAt.toISOString() })), category: product.category ? serializeCategory(product.category) : null, collection: product.collection ? serializeCollection(product.collection) : null }
}
export function serializeSettings(settings: StoreSettings) { return { ...settings, heroImage: toPrivateBlobProxyUrl(settings.heroImage), createdAt: settings.createdAt.toISOString(), updatedAt: settings.updatedAt.toISOString() } }
