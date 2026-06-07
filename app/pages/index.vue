<script setup lang="ts">
import type { ProductDTO, CategoryDTO, CollectionDTO, StoreSettingsDTO } from '~~/shared/types'

const route = useRoute()
const router = useRouter()
const ALL_VALUE = '__all__'

const filtersOpen = ref(false)
const selectedProduct = ref(route.query.product ? String(route.query.product) : ALL_VALUE)
const category = ref(route.query.category ? String(route.query.category) : ALL_VALUE)
const collection = ref(route.query.collection ? String(route.query.collection) : ALL_VALUE)
const size = ref(route.query.size ? String(route.query.size) : ALL_VALUE)
const color = ref(route.query.color ? String(route.query.color) : ALL_VALUE)
const availability = ref(route.query.available ? String(route.query.available) : ALL_VALUE)
const sort = ref(String(route.query.sort || 'recentes'))

const selected = (value: string) => value === ALL_VALUE ? undefined : value

const productQuery = computed(() => ({
  product: selected(selectedProduct.value),
  category: selected(category.value),
  collection: selected(collection.value),
  size: selected(size.value),
  color: selected(color.value),
  available: selected(availability.value),
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

const productItems = computed(() => [
  { label: 'Todos os produtos', value: ALL_VALUE },
  ...(allProducts.value || []).map((item) => ({ label: item.name, value: item.slug }))
])

const categoryItems = computed(() => [
  { label: 'Todas as categorias', value: ALL_VALUE },
  ...(categories.value || []).map((item) => ({ label: item.name, value: item.slug }))
])

const collectionItems = computed(() => [
  { label: 'Todas as colecoes', value: ALL_VALUE },
  ...(collections.value || []).map((item) => ({ label: item.name, value: item.slug }))
])

const sizeItems = computed(() => [
  { label: 'Todos os tamanhos', value: ALL_VALUE },
  ...uniqueOptions((allProducts.value || []).flatMap((item) => item.sizes)).map((item) => ({ label: item, value: item }))
])

const colorItems = computed(() => [
  { label: 'Todas as cores', value: ALL_VALUE },
  ...uniqueOptions((allProducts.value || []).flatMap((item) => item.colors)).map((item) => ({ label: item, value: item }))
])

const availabilityItems = [
  { label: 'Todos', value: ALL_VALUE },
  { label: 'Disponiveis', value: 'available' }
]

const sortItems = [
  { label: 'Mais recentes', value: 'recentes' },
  { label: 'Menor preco', value: 'menor-preco' },
  { label: 'Maior preco', value: 'maior-preco' },
  { label: 'Destaques', value: 'destaques' }
]

const activeFilters = computed(() => [
  selectedProduct.value !== ALL_VALUE ? productItems.value.find((item) => item.value === selectedProduct.value)?.label : '',
  category.value !== ALL_VALUE ? categoryItems.value.find((item) => item.value === category.value)?.label : '',
  collection.value !== ALL_VALUE ? collectionItems.value.find((item) => item.value === collection.value)?.label : '',
  size.value !== ALL_VALUE ? size.value : '',
  color.value !== ALL_VALUE ? color.value : '',
  availability.value !== ALL_VALUE ? 'Disponiveis' : ''
].filter(Boolean))

function clearFilters() {
  selectedProduct.value = ALL_VALUE
  category.value = ALL_VALUE
  collection.value = ALL_VALUE
  size.value = ALL_VALUE
  color.value = ALL_VALUE
  availability.value = ALL_VALUE
  sort.value = 'recentes'
}

watch(
  () => route.query,
  (nextQuery) => {
    selectedProduct.value = nextQuery.product ? String(nextQuery.product) : ALL_VALUE
    category.value = nextQuery.category ? String(nextQuery.category) : ALL_VALUE
    collection.value = nextQuery.collection ? String(nextQuery.collection) : ALL_VALUE
    size.value = nextQuery.size ? String(nextQuery.size) : ALL_VALUE
    color.value = nextQuery.color ? String(nextQuery.color) : ALL_VALUE
    availability.value = nextQuery.available ? String(nextQuery.available) : ALL_VALUE
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

        <button type="button" class="caju-button caju-button-outline shrink-0" @click="filtersOpen = !filtersOpen">
          <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4" />
          Filtros
          <span v-if="activeFilters.length" class="rounded bg-[var(--caju-yellow)] px-1.5 py-0.5 text-[11px]">
            {{ activeFilters.length }}
          </span>
        </button>
      </div>

      <div v-if="filtersOpen" class="caju-field caju-card mb-5 rounded-xl p-4">
        <div class="mb-4 flex items-center justify-between gap-3">
          <strong class="text-sm font-black uppercase text-black/50">Filtros</strong>
          <button type="button" class="text-xs font-black text-black/55" @click="clearFilters">
            Limpar
          </button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <UFormField label="Produto">
            <USelectMenu
              v-model="selectedProduct"
              class="w-full"
              :items="productItems"
              value-key="value"
              :search-input="{ placeholder: 'Digite para buscar' }"
            >
              <template #empty>
                Nenhum produto encontrado.
              </template>
            </USelectMenu>
          </UFormField>

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

          <UFormField label="Tamanho">
            <USelectMenu
              v-model="size"
              class="w-full"
              :items="sizeItems"
              value-key="value"
              :search-input="{ placeholder: 'Digite para buscar' }"
            >
              <template #empty>
                Nenhum tamanho encontrado.
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

          <UFormField label="Disponibilidade">
            <USelect v-model="availability" class="w-full" :items="availabilityItems" />
          </UFormField>

          <UFormField label="Ordenar">
            <USelect v-model="sort" class="w-full" :items="sortItems" />
          </UFormField>
        </div>
      </div>

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
