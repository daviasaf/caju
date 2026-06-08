<script setup lang="ts">
import type { ProductDTO } from '~~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { success, error } = useAdminAction()
const { formatMoney } = useMoney()
const { data: products, pending, refresh } = await useFetch<ProductDTO[]>('/api/admin/products')

const search = ref('')
const status = ref<'todos' | 'ativos' | 'inativos'>('todos')
const deleting = ref<ProductDTO | null>(null)
const loadingDelete = ref(false)
const featuring = ref<string | null>(null)

const statusItems = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' }
]

const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}

const filteredProducts = computed(() => {
  const term = search.value.trim().toLowerCase()

  return (products.value || []).filter((product) => {
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.slug.toLowerCase().includes(term) ||
      product.category?.name?.toLowerCase().includes(term) ||
      product.collection?.name?.toLowerCase().includes(term)

    const matchesStatus =
      status.value === 'todos' ||
      (status.value === 'ativos' && product.active) ||
      (status.value === 'inativos' && !product.active)

    return matchesSearch && matchesStatus
  })
})

async function removeProduct() {
  if (!deleting.value) return

  loadingDelete.value = true

  try {
    await $fetch(`/api/admin/products/${deleting.value.id}`, { method: 'DELETE' })
    success('Produto apagado')
    deleting.value = null
    await refresh()
  } catch (err: any) {
    error('Erro ao apagar', err)
  } finally {
    loadingDelete.value = false
  }
}

async function selectFeaturedProduct(product: ProductDTO) {
  if (product.featured || featuring.value) return

  featuring.value = product.id

  try {
    await $fetch(`/api/admin/products/${product.id}/featured`, { method: 'PUT' })
    success('Destaque atualizado', `${product.name} agora aparece no topo da home.`)
    await refresh()
  } catch (err: any) {
    error('Erro ao destacar', err)
  } finally {
    featuring.value = null
  }
}
</script>

<template>
  <AdminShell title="Produtos" description="Gerencie catalogo, estoque, imagens e destaque na home.">
    <div class="grid gap-4 md:grid-cols-3">
      <AdminMetricCard label="Produtos" :value="products?.length || 0" icon="i-lucide-shopping-bag" />
      <AdminMetricCard label="Ativos" :value="products?.filter((item) => item.active).length || 0" icon="i-lucide-check-circle" tone="#6D7A3B" />
      <AdminMetricCard label="Destaques" :value="products?.filter((item) => item.featured).length || 0" icon="i-lucide-star" tone="#FFC928" />
    </div>

    <UCard class="mt-6 !bg-white">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end">
        <UFormField label="Buscar produto">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Nome, categoria ou colecao" />
        </UFormField>

        <UFormField label="Status">
          <USelect v-model="status" :items="statusItems" />
        </UFormField>

        <UButton to="/admin/produtos/novo" icon="i-lucide-plus" size="lg" class="lg:justify-self-end">
          Novo produto
        </UButton>
      </div>
    </UCard>

    <USkeleton v-if="pending" class="mt-6 h-96 rounded-xl" />

    <AdminDataTable
      v-else-if="filteredProducts.length"
      class="mt-6"
      title="Catalogo"
      :description="`${filteredProducts.length} item(ns) encontrado(s)`"
    >
      <table class="w-full min-w-[860px] text-left text-sm">
        <thead class="text-xs uppercase text-black/40">
          <tr>
            <th class="py-3 pr-4">Produto</th>
            <th class="px-4">Categoria</th>
            <th class="px-4">Colecao</th>
            <th class="px-4">Preco</th>
            <th class="px-4">Status</th>
            <th class="px-4 text-right">Acoes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-black/10">
          <tr v-for="product in filteredProducts" :key="product.id" class="align-middle">
            <td class="py-4 pr-4">
              <div class="flex items-center gap-3">
                <img
                  :src="product.images?.[0]?.url || fallbackImage"
                  :alt="product.name"
                  class="h-14 w-14 rounded-lg object-cover"
                  @error="useFallbackImage"
                >
                <div>
                  <strong class="block font-black">{{ product.name }}</strong>
                  <span class="text-xs text-black/45">{{ product.category?.name || product.collection?.name || 'Catalogo' }}</span>
                </div>
              </div>
            </td>
            <td class="px-4">{{ product.category?.name || '-' }}</td>
            <td class="px-4">{{ product.collection?.name || '-' }}</td>
            <td class="px-4 font-black">{{ formatMoney(product.promotionalPrice || product.price) }}</td>
            <td class="px-4">
              <div class="flex gap-2">
                <UBadge :color="product.active ? 'success' : 'neutral'" variant="soft">
                  {{ product.active ? 'Ativo' : 'Inativo' }}
                </UBadge>
                <UBadge v-if="product.featured" color="warning" variant="soft">Home</UBadge>
              </div>
            </td>
            <td class="px-4 text-right">
              <UDropdownMenu
                :items="[[
                  {
                    label: product.featured ? 'Destaque atual' : 'Selecionar destaque',
                    icon: 'i-lucide-star',
                    disabled: product.featured || Boolean(featuring),
                    onSelect: () => selectFeaturedProduct(product)
                  },
                  { label: 'Editar', icon: 'i-lucide-pencil', to: `/admin/produtos/${product.id}` },
                  { label: 'Ver publico', icon: 'i-lucide-external-link', to: `/produtos/${product.slug}`, target: '_blank' },
                  { label: 'Apagar', icon: 'i-lucide-trash', color: 'error', onSelect: () => deleting = product }
                ]]"
              >
                <UButton
                  icon="i-lucide-more-horizontal"
                  color="neutral"
                  variant="ghost"
                  :loading="featuring === product.id"
                  aria-label="Acoes"
                />
              </UDropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </AdminDataTable>

    <UCard v-else class="mt-6 !bg-white text-center">
      <div class="mx-auto max-w-md py-12">
        <UIcon name="i-lucide-package-open" class="mx-auto h-12 w-12 text-black/30" />
        <h2 class="mt-4 text-3xl font-black">Nenhum produto encontrado</h2>
        <p class="mt-2 text-black/55">Crie um produto novo ou limpe os filtros de busca.</p>
        <div class="mt-6 flex justify-center gap-2">
          <UButton to="/admin/produtos/novo" icon="i-lucide-plus">Novo produto</UButton>
          <UButton color="neutral" variant="soft" @click="search = ''; status = 'todos'">Limpar filtros</UButton>
        </div>
      </div>
    </UCard>

    <AdminDeleteConfirmModal
      :open="Boolean(deleting)"
      :loading="loadingDelete"
      :title="`Apagar ${deleting?.name || 'produto'}?`"
      description="O produto e suas imagens vinculadas no banco serao removidos do catalogo."
      @update:open="(value) => { if (!value) deleting = null }"
      @confirm="removeProduct"
    />
  </AdminShell>
</template>
