<script setup lang="ts">
import type { ProductDTO, CollectionDTO } from '~~/shared/types'

const route = useRoute()
const { ogLogoUrl } = usePublicUrl()
const { data, error } = await useFetch<{ collection: CollectionDTO, products: ProductDTO[] }>(`/api/collections/${route.params.slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Coleção não encontrada.' })
}

useSeoMeta({
  title: () => `${data.value?.collection?.name || 'Coleção'} - CAJU`,
  description: () => data.value?.collection?.description || 'Coleção autoral da CAJU.',
  ogImage: ogLogoUrl,
  twitterImage: ogLogoUrl
})
</script>

<template>
  <div v-if="data" class="page-shell py-12">
    <div class="mb-10 rounded-2xl border border-[color:var(--caju-border)] bg-white p-8 md:p-10">
      <NuxtLink to="/colecoes" class="caju-button caju-button-outline w-fit">
        <UIcon name="i-lucide-arrow-left" class="h-5 w-5" />
        Voltar
      </NuxtLink>
      <p class="caju-kicker mt-8">Coleção</p>
      <h1 class="caju-title mt-2 text-5xl md:text-7xl">{{ data.collection.name }}</h1>
      <p class="mt-5 max-w-2xl text-xl leading-relaxed text-black/65">{{ data.collection.description }}</p>
    </div>
    <PublicProductGrid :products="data.products" />
  </div>
</template>
