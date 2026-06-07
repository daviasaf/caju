<script setup lang="ts">
import type { CollectionDTO } from '~~/shared/types'

defineProps<{ collection: CollectionDTO }>()

const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}
</script>

<template>
  <NuxtLink
    :to="`/colecoes/${collection.slug}`"
    class="block overflow-hidden rounded-2xl border border-[color:var(--caju-border)] bg-white p-3"
  >
    <div class="relative overflow-hidden rounded-xl bg-[#f6f0e2]">
      <img
        :src="collection.image || fallbackImage"
        :alt="collection.name"
        class="aspect-[4/3] w-full object-cover"
        @error="useFallbackImage"
      >
      <span
        class="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black uppercase text-[var(--caju-ink)]"
        :style="{ backgroundColor: collection.highlightColor || '#FFC928' }"
      >
        Coleção
      </span>
    </div>
    <div class="p-2 pt-5">
      <h3 class="text-2xl font-black leading-tight">{{ collection.name }}</h3>
      <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-black/60">{{ collection.description }}</p>
    </div>
  </NuxtLink>
</template>
