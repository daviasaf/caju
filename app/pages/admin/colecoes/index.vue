<script setup lang="ts">
import type { CollectionDTO } from '~~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { success, error } = useAdminAction()
const { data: collections, pending, refresh } = await useFetch<CollectionDTO[]>('/api/admin/collections')

const search = ref('')
const status = ref<'todas' | 'ativas' | 'inativas'>('todas')
const deleting = ref<CollectionDTO | null>(null)
const loadingDelete = ref(false)

const statusItems = [
  { label: 'Todas', value: 'todas' },
  { label: 'Ativas', value: 'ativas' },
  { label: 'Inativas', value: 'inativas' }
]

const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}

const filteredCollections = computed(() => {
  const term = search.value.trim().toLowerCase()

  return (collections.value || []).filter((collection) => {
    const matchesSearch =
      !term ||
      collection.name.toLowerCase().includes(term) ||
      collection.slug.toLowerCase().includes(term) ||
      collection.description?.toLowerCase().includes(term)

    const matchesStatus =
      status.value === 'todas' ||
      (status.value === 'ativas' && collection.active) ||
      (status.value === 'inativas' && !collection.active)

    return matchesSearch && matchesStatus
  })
})

async function removeCollection() {
  if (!deleting.value) return

  loadingDelete.value = true

  try {
    await $fetch(`/api/admin/collections/${deleting.value.id}`, { method: 'DELETE' })
    success('Colecao apagada')
    deleting.value = null
    await refresh()
  } catch (err: any) {
    error('Erro ao apagar', err)
  } finally {
    loadingDelete.value = false
  }
}
</script>

<template>
  <AdminShell title="Colecoes" description="Crie drops e destaques para a home.">
    <UCard class="!bg-white">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="grid flex-1 gap-3 sm:grid-cols-[1fr_180px]">
          <UFormField label="Buscar colecao">
            <UInput v-model="search" icon="i-lucide-search" placeholder="Nome ou descricao" />
          </UFormField>
          <UFormField label="Status">
            <USelect v-model="status" :items="statusItems" />
          </UFormField>
        </div>

        <UButton to="/admin/colecoes/novo" icon="i-lucide-plus" size="lg">
          Nova colecao
        </UButton>
      </div>
    </UCard>

    <USkeleton v-if="pending" class="mt-6 h-96 rounded-[1.75rem]" />

    <div v-else-if="filteredCollections.length" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UCard v-for="collection in filteredCollections" :key="collection.id" class="overflow-hidden !bg-white">
        <img
          :src="collection.image || fallbackImage"
          :alt="collection.name"
          class="aspect-video w-full rounded-xl object-cover"
          @error="useFallbackImage"
        >

        <div class="mt-4 flex items-start justify-between gap-3">
          <div>
            <strong class="text-xl font-black tracking-[-0.05em]">{{ collection.name }}</strong>
            <p class="line-clamp-2 text-sm text-black/55">{{ collection.description || 'Sem descricao' }}</p>
          </div>

          <UDropdownMenu
            :items="[[
              { label: 'Editar', icon: 'i-lucide-pencil', to: `/admin/colecoes/${collection.id}` },
              { label: 'Ver publico', icon: 'i-lucide-external-link', to: `/colecoes/${collection.slug}`, target: '_blank' },
              { label: 'Apagar', icon: 'i-lucide-trash', color: 'error', onSelect: () => deleting = collection }
            ]]"
          >
            <UButton icon="i-lucide-more-horizontal" color="neutral" variant="ghost" aria-label="Acoes" />
          </UDropdownMenu>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <UBadge :color="collection.active ? 'success' : 'neutral'" variant="soft">
            {{ collection.active ? 'Ativa' : 'Inativa' }}
          </UBadge>
          <UBadge v-if="collection.featured" color="warning" variant="soft">Home</UBadge>
          <span
            class="h-6 w-6 rounded-md border border-black/10"
            :style="{ backgroundColor: collection.highlightColor || '#FFC928' }"
            aria-label="Cor de destaque"
          />
        </div>
      </UCard>
    </div>

    <UCard v-else class="mt-6 !bg-white text-center">
      <div class="mx-auto max-w-md py-12">
        <UIcon name="i-lucide-layers-3" class="mx-auto h-12 w-12 text-black/30" />
        <h2 class="mt-4 text-3xl font-black tracking-[-0.06em]">Nenhuma colecao encontrada</h2>
        <p class="mt-2 text-black/55">Crie um drop novo ou limpe os filtros atuais.</p>
        <div class="mt-6 flex justify-center gap-2">
          <UButton to="/admin/colecoes/novo" icon="i-lucide-plus">Nova colecao</UButton>
          <UButton color="neutral" variant="soft" @click="search = ''; status = 'todas'">Limpar filtros</UButton>
        </div>
      </div>
    </UCard>

    <AdminDeleteConfirmModal
      :open="Boolean(deleting)"
      :loading="loadingDelete"
      :title="`Apagar ${deleting?.name || 'colecao'}?`"
      @update:open="(value) => { if (!value) deleting = null }"
      @confirm="removeCollection"
    />
  </AdminShell>
</template>
