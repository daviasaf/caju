<script setup lang="ts">
import type { ProductDTO, StoreSettingsDTO } from '~~/shared/types'

const props = defineProps<{
  settings?: StoreSettingsDTO | null
  featuredProduct?: ProductDTO | null
}>()

const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'
const heroImage = computed(() => props.settings?.heroImage || props.featuredProduct?.images?.[0]?.url || fallbackImage)

function useFallbackImage(event: Event) {
  const image = event.target as HTMLImageElement
  if (!image.src.endsWith(fallbackImage)) image.src = fallbackImage
}

function scrollToProducts() {
  if (!import.meta.client) return
  document.getElementById('produtos')?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <section class="page-shell grid items-center gap-5 py-5 sm:gap-8 sm:py-9 lg:grid-cols-[1fr_.78fr] lg:py-10">
    <div class="max-w-2xl">
      <p class="caju-kicker mb-2 sm:mb-4">Quissama, RJ</p>

      <h1 class="caju-title max-w-4xl text-3xl sm:text-5xl lg:text-6xl">
        {{ settings?.heroTitle || 'Vista Quissama.' }}
      </h1>

      <p class="mt-3 max-w-xl text-sm font-medium leading-relaxed text-black/65 sm:mt-5 sm:text-lg">
        {{ settings?.heroSubtitle || 'Produtos com alma local, feitos para circular pelo Brasil. Colecoes autorais inspiradas no nosso chao.' }}
      </p>

      <div class="mt-5 sm:mt-7">
        <button type="button" class="caju-button caju-button-primary px-5" @click="scrollToProducts">
          <UIcon name="i-lucide-shopping-bag" class="h-5 w-5" />
          Ver produtos
        </button>
      </div>
    </div>

    <figure class="caju-card overflow-hidden rounded-xl p-2">
      <img
        :src="heroImage"
        alt="Produto CAJU em destaque"
        class="aspect-[16/11] w-full rounded-lg bg-white object-cover sm:aspect-[4/3] lg:aspect-[4/5] lg:max-h-[520px]"
        @error="useFallbackImage"
      >
      <figcaption class="flex items-center justify-between gap-4 px-2 py-2.5">
        <div class="min-w-0">
          <p class="text-xs font-black uppercase text-[var(--caju-muted)]">Destaque</p>
          <strong class="mt-1 block truncate text-base font-black">
            {{ featuredProduct?.name || 'CAJU autoral' }}
          </strong>
        </div>
        <button type="button" class="caju-button caju-button-outline shrink-0 px-3" aria-label="Ver produtos" @click="scrollToProducts">
          <UIcon name="i-lucide-arrow-up-right" class="h-5 w-5" />
        </button>
      </figcaption>
    </figure>
  </section>
</template>
