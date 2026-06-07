<script setup lang="ts">
import type { ProductDTO } from '~~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: stats, pending } = await useFetch<{
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  categories: number
  collections: number
  featuredProducts: number
  latestProducts: ProductDTO[]
}>('/api/admin/stats')

const { formatMoney } = useMoney()
const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}
</script>

<template>
  <AdminShell title="Dashboard" description="Visao geral da loja CAJU.">
    <div v-if="pending" class="grid gap-4 md:grid-cols-3">
      <USkeleton v-for="item in 6" :key="item" class="h-32 rounded-xl" />
    </div>

    <div v-else class="space-y-8">
      <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <AdminMetricCard label="Produtos" :value="stats?.totalProducts || 0" icon="i-lucide-package" tone="#FFC928" description="catalogo" />
        <AdminMetricCard label="Ativos" :value="stats?.activeProducts || 0" icon="i-lucide-eye" tone="#028CE8" description="na loja" />
        <AdminMetricCard label="Inativos" :value="stats?.inactiveProducts || 0" icon="i-lucide-eye-off" tone="#EAD8A6" description="ocultos" />
        <AdminMetricCard label="Categorias" :value="stats?.categories || 0" icon="i-lucide-tags" tone="#F47C20" description="filtros" />
        <AdminMetricCard label="Colecoes" :value="stats?.collections || 0" icon="i-lucide-layers-3" tone="#6D7A3B" description="drops" />
        <AdminMetricCard label="Destaques" :value="stats?.featuredProducts || 0" icon="i-lucide-star" tone="#D71920" description="home" />
      </div>

      <UCard class="!bg-white">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <strong class="text-xl font-black">Ultimos produtos</strong>
              <p class="mt-1 text-sm text-black/50">Acesse rapidamente os cadastros recentes.</p>
            </div>
            <UButton to="/admin/produtos/novo" icon="i-lucide-plus">Novo</UButton>
          </div>
        </template>

        <div v-if="stats?.latestProducts?.length" class="divide-y divide-black/10">
          <NuxtLink
            v-for="product in stats.latestProducts"
            :key="product.id"
            :to="`/admin/produtos/${product.id}`"
            class="flex items-center gap-4 py-4"
          >
            <img :src="product.images?.[0]?.url || fallbackImage" :alt="product.name" class="h-14 w-14 rounded-lg object-cover sm:h-16 sm:w-16" @error="useFallbackImage">
            <div class="min-w-0 flex-1">
              <strong class="block truncate font-black">{{ product.name }}</strong>
              <span class="text-sm text-black/50">{{ product.collection?.name || 'Sem colecao' }}</span>
            </div>
            <span class="font-black">{{ formatMoney(product.promotionalPrice || product.price) }}</span>
          </NuxtLink>
        </div>

        <div v-else class="py-12 text-center text-black/55">
          Nenhum produto cadastrado ainda.
        </div>
      </UCard>
    </div>
  </AdminShell>
</template>
