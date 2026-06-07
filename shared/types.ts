export interface ProductImageDTO { id?: string; url: string; alt?: string | null; order?: number }
export interface CategoryDTO { id: string; name: string; slug: string; description?: string | null; color?: string | null; icon?: string | null; active: boolean; order: number }
export interface CollectionDTO { id: string; name: string; slug: string; description?: string | null; image?: string | null; highlightColor?: string | null; active: boolean; featured: boolean; order: number }
export interface ProductDTO {
  id: string; name: string; slug: string; shortDescription?: string | null; description?: string | null;
  price: number; promotionalPrice?: number | null; images: ProductImageDTO[];
  category?: CategoryDTO | null; categoryId?: string | null; collection?: CollectionDTO | null; collectionId?: string | null;
  sizes: string[]; colors: string[]; materials: string[]; tags: string[];
  active: boolean; featured: boolean; stock?: number | null; order: number; seoTitle?: string | null; seoDescription?: string | null;
}
export interface StoreSettingsDTO {
  id: string; storeName: string; whatsappNumber: string; instagram?: string | null; city?: string | null; state?: string | null;
  heroTitle?: string | null; heroSubtitle?: string | null; heroImage?: string | null; featuredProductId?: string | null; featuredCollectionId?: string | null;
  paymentText?: string | null; shippingText?: string | null; seoTitle?: string | null; seoDescription?: string | null;
}
