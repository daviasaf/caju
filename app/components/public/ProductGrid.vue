<script setup lang="ts">
import type { ProductDTO } from '~~/shared/types'

defineProps<{ products?: ProductDTO[] | null; pending?: boolean }>()
</script>

<template>
  <div>
    <div v-if="pending" class="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      <USkeleton v-for="item in 8" :key="item" class="h-64 rounded-xl sm:h-[26rem]" />
    </div>

    <PublicEmptyState
      v-else-if="!products?.length"
      title="Nenhum produto encontrado"
      description="Ajuste os filtros para ver as opcoes disponiveis."
      icon="i-lucide-search-x"
    />

    <div v-else class="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      <PublicProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>
