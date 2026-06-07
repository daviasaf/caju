<script setup lang="ts">
import type { ProductDTO, CategoryDTO, CollectionDTO, StoreSettingsDTO } from '~~/shared/types'

const route = useRoute()
const router = useRouter()
const ALL_VALUE = '__all__'

const filtersOpen = ref(false)
const search = ref(route.query.search ? String(route.query.search) : '')
const category = ref(route.query.category ? String(route.query.category) : ALL_VALUE)
const collection = ref(route.query.collection ? String(route.query.collection) : ALL_VALUE)
const color = ref(route.query.color ? String(route.query.color) : ALL_VALUE)
const sort = ref(String(route.query.sort || 'recentes'))

const selected = (value: string) => value === ALL_VALUE ? undefined : value

const productQuery = computed(() => ({
  search: search.value.trim() || undefined,
  category: selected(category.value),
  collection: selected(collection.value),
  color: selected(color.value),
  sort: sort.value !== 'recentes' ? sort.value : undefined
}))

const { data: settings } = await useFetch<StoreSettingsDTO>('/api/settings')
const { data: products, pending } = await useFetch<ProductDTO[]>('/api/products', {
  key: 'home-products-filtered',
  query: productQuery,
  watch: [productQuery]
})
const { data: allProducts } = await useFetch<ProductDTO[]>('/api/products', {
  key: 'home-products-options',
  query: { sort: 'recentes' }
})
const { data: collections } = await useFetch<CollectionDTO[]>('/api/collections')
const { data: categories } = await useFetch<CategoryDTO[]>('/api/categories')

const featuredProduct = computed(() => {
  const items = allProducts.value || []

  return (
    items.find((item) => item.id === settings.value?.featuredProductId) ||
    items.find((item) => item.featured) ||
    items[0] ||
    null
  )
})

function uniqueOptions(values: string[]) {
  return [...new Set(values.map((item) => item.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

const categoryItems = computed(() => [
  { label: 'Todas as categorias', value: ALL_VALUE },
  ...(categories.value || []).map((item) => ({ label: item.name, value: item.slug }))
])

const collectionItems = computed(() => [
  { label: 'Todas as colecoes', value: ALL_VALUE },
  ...(collections.value || []).map((item) => ({ label: item.name, value: item.slug }))
])

const colorItems = computed(() => [
  { label: 'Todas as cores', value: ALL_VALUE },
  ...uniqueOptions((allProducts.value || []).flatMap((item) => item.colors)).map((item) => ({ label: item, value: item }))
])

const sortItems = [
  { label: 'Mais recentes', value: 'recentes' },
  { label: 'Menor preco', value: 'menor-preco' },
  { label: 'Maior preco', value: 'maior-preco' },
  { label: 'Destaques', value: 'destaques' }
]

const activeFilters = computed(() => [
  category.value !== ALL_VALUE ? categoryItems.value.find((item) => item.value === category.value)?.label : '',
  collection.value !== ALL_VALUE ? collectionItems.value.find((item) => item.value === collection.value)?.label : '',
  color.value !== ALL_VALUE ? color.value : ''
].filter(Boolean))

function clearFilters() {
  category.value = ALL_VALUE
  collection.value = ALL_VALUE
  color.value = ALL_VALUE
  sort.value = 'recentes'
}

function clearSearch() {
  search.value = ''
}

watch(
  () => route.query,
  (nextQuery) => {
    search.value = nextQuery.search ? String(nextQuery.search) : ''
    category.value = nextQuery.category ? String(nextQuery.category) : ALL_VALUE
    collection.value = nextQuery.collection ? String(nextQuery.collection) : ALL_VALUE
    color.value = nextQuery.color ? String(nextQuery.color) : ALL_VALUE
    sort.value = String(nextQuery.sort || 'recentes')
  }
)

watch(
  productQuery,
  (nextQuery) => {
    if (!import.meta.client) return

    const next = Object.fromEntries(Object.entries(nextQuery).filter(([, value]) => Boolean(value)))
    if (JSON.stringify(next) !== JSON.stringify(route.query)) {
      router.replace({ path: '/', query: next })
    }
  },
  { deep: true }
)

useSeoMeta({
  title: () => settings.value?.seoTitle || 'CAJU - Vista Quissama',
  description: () => settings.value?.seoDescription || 'Produtos autorais inspirados em Quissama, praia, natureza e cultura local.',
  ogImage: () => settings.value?.heroImage || featuredProduct.value?.images?.[0]?.url
})
</script>

<template>
  <div>
    <PublicHeroSection :settings="settings" :featured-product="featuredProduct" />

    <section id="produtos" class="page-shell py-6 sm:py-10">
      <div class="mb-4 flex items-end justify-between gap-3">
        <div>
          <p class="caju-kicker">Loja</p>
          <h2 class="caju-title mt-1 text-2xl sm:text-4xl lg:text-5xl">Produtos</h2>
          <p class="mt-1 text-xs font-bold text-black/50 sm:text-sm">
            {{ pending ? 'Carregando...' : `${products?.length || 0} produto(s)` }}
          </p>
        </div>

        <button type="button" class="caju-button caju-button-outline shrink-0" @click="filtersOpen = true">
          <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4" />
          Filtros
          <span v-if="activeFilters.length" class="rounded bg-[var(--caju-yellow)] px-1.5 py-0.5 text-[11px]">
            {{ activeFilters.length }}
          </span>
        </button>
      </div>

      <div class="mb-4 flex items-center gap-2">
        <UInput
          v-model="search"
          class="w-full"
          size="lg"
          icon="i-lucide-search"
          placeholder="Buscar produtos, categorias, colecoes..."
        />
        <button v-if="search" type="button" class="caju-button caju-button-outline shrink-0" @click="clearSearch">
          Limpar
        </button>
      </div>

      <Teleport to="body">
        <div v-if="filtersOpen" class="fixed inset-0 z-50">
          <button
            type="button"
            class="absolute inset-0 bg-black/45"
            aria-label="Fechar filtros"
            @click="filtersOpen = false"
          />

          <section class="caju-field absolute inset-x-3 bottom-3 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-xl bg-white p-4 text-[var(--caju-ink)] shadow-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2">
            <div class="mb-4 flex items-center justify-between gap-3">
              <strong class="text-base font-black">Filtros</strong>
              <button type="button" class="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--caju-border)] bg-white" aria-label="Fechar filtros" @click="filtersOpen = false">
                <UIcon name="i-lucide-x" class="h-4 w-4" />
              </button>
            </div>

            <div class="grid gap-3">
              <UFormField label="Categoria">
                <USelectMenu
                  v-model="category"
                  class="w-full"
                  :items="categoryItems"
                  value-key="value"
                  :search-input="{ placeholder: 'Digite para buscar' }"
                >
                  <template #empty>
                    Nenhuma categoria encontrada.
                  </template>
                </USelectMenu>
              </UFormField>

              <UFormField label="Colecao">
                <USelectMenu
                  v-model="collection"
                  class="w-full"
                  :items="collectionItems"
                  value-key="value"
                  :search-input="{ placeholder: 'Digite para buscar' }"
                >
                  <template #empty>
                    Nenhuma colecao encontrada.
                  </template>
                </USelectMenu>
              </UFormField>

              <UFormField label="Cor">
                <USelectMenu
                  v-model="color"
                  class="w-full"
                  :items="colorItems"
                  value-key="value"
                  :search-input="{ placeholder: 'Digite para buscar' }"
                >
                  <template #empty>
                    Nenhuma cor encontrada.
                  </template>
                </USelectMenu>
              </UFormField>

              <UFormField label="Ordenar">
                <USelect v-model="sort" class="w-full" :items="sortItems" />
              </UFormField>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
              <button type="button" class="caju-button caju-button-outline" @click="clearFilters">
                Limpar
              </button>
              <button type="button" class="caju-button caju-button-primary" @click="filtersOpen = false">
                Aplicar
              </button>
            </div>
          </section>
        </div>
      </Teleport>

      <div v-if="activeFilters.length" class="mb-4 flex flex-wrap items-center gap-2">
        <span
          v-for="filter in activeFilters"
          :key="filter"
          class="rounded-lg border border-[color:var(--caju-border)] bg-white px-3 py-1 text-xs font-bold text-black/60"
        >
          {{ filter }}
        </span>
      </div>

      <PublicProductGrid :products="products" :pending="pending" />
    </section>
  </div>
</template>
