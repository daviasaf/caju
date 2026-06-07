<script setup lang="ts">
import type { ProductDTO } from '~~/shared/types'

const props = defineProps<{ product: ProductDTO }>()
const { formatMoney } = useMoney()

const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'
const image = computed(() => props.product.images?.[0]?.url || fallbackImage)
const price = computed(() => props.product.promotionalPrice || props.product.price)
const hasPromotion = computed(() => Boolean(props.product.promotionalPrice && props.product.promotionalPrice < props.product.price))

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}

async function goToProduct() {
  await navigateTo(`/produtos/${props.product.slug}`)
}
</script>

<template>
  <button
    type="button"
    class="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[color:var(--caju-border)] bg-white text-left text-[var(--caju-ink)]"
    @click="goToProduct"
  >
    <div class="relative w-full overflow-hidden bg-[#f6f0e7]">
      <img
        :src="image"
        :alt="product.images?.[0]?.alt || product.name"
        class="aspect-square w-full object-cover sm:aspect-[4/5]"
        @error="useFallbackImage"
      >

      <div v-if="hasPromotion" class="absolute left-2 top-2 rounded-md bg-[var(--caju-red)] px-2 py-1 text-[10px] font-black uppercase text-white sm:left-3 sm:top-3">
        Oferta
      </div>
    </div>

    <div class="flex min-h-0 flex-1 flex-col p-2.5 sm:p-4">
      <p v-if="product.category" class="text-[10px] font-black uppercase text-black/42 sm:text-xs">
        {{ product.category.name }}
      </p>

      <h3 class="mt-1 min-h-[2.2rem] text-[13px] font-black leading-tight sm:min-h-[3.25rem] sm:text-lg">
        {{ product.name }}
      </h3>

      <p class="mt-2 hidden min-h-[2.75rem] text-sm leading-relaxed text-black/58 sm:line-clamp-2">
        {{ product.shortDescription || 'Produto autoral da CAJU.' }}
      </p>

      <div class="mt-auto pt-3">
        <span class="block whitespace-nowrap text-base font-black sm:text-xl">{{ formatMoney(price) }}</span>
        <span v-if="hasPromotion" class="block whitespace-nowrap text-xs text-black/40 line-through">{{ formatMoney(product.price) }}</span>
      </div>
    </div>
  </button>
</template>
