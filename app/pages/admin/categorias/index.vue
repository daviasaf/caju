<script setup lang="ts">
import type { CategoryDTO } from '~~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { success, error } = useAdminAction()
const { data: categories, pending, refresh } = await useFetch<CategoryDTO[]>('/api/admin/categories')

const search = ref('')
const status = ref<'todos' | 'ativas' | 'inativas'>('todos')
const deleting = ref<CategoryDTO | null>(null)
const loadingDelete = ref(false)

const statusItems = [
  { label: 'Todas', value: 'todos' },
  { label: 'Ativas', value: 'ativas' },
  { label: 'Inativas', value: 'inativas' }
]

const filteredCategories = computed(() => {
  const term = search.value.trim().toLowerCase()

  return (categories.value || []).filter((category) => {
    const matchesSearch =
      !term ||
      category.name.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term) ||
      category.description?.toLowerCase().includes(term)

    const matchesStatus =
      status.value === 'todos' ||
      (status.value === 'ativas' && category.active) ||
      (status.value === 'inativas' && !category.active)

    return matchesSearch && matchesStatus
  })
})

async function removeCategory() {
  if (!deleting.value) return

  loadingDelete.value = true

  try {
    await $fetch(`/api/admin/categories/${deleting.value.id}`, { method: 'DELETE' })
    success('Categoria apagada')
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
  <AdminShell title="Categorias" description="Organize tipos de produto, cores e icones publicos.">
    <UCard class="!bg-white">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="grid flex-1 gap-3 sm:grid-cols-[1fr_180px]">
          <UFormField label="Buscar categoria">
            <UInput v-model="search" icon="i-lucide-search" placeholder="Nome ou descricao" />
          </UFormField>
          <UFormField label="Status">
            <USelect v-model="status" :items="statusItems" />
          </UFormField>
        </div>

        <UButton to="/admin/categorias/novo" icon="i-lucide-plus" size="lg">
          Nova categoria
        </UButton>
      </div>
    </UCard>

    <USkeleton v-if="pending" class="mt-6 h-96 rounded-[1.75rem]" />

    <UCard v-else-if="filteredCategories.length" class="mt-6 !bg-white">
      <template #header>
        <div>
          <strong class="text-xl font-black tracking-[-0.05em]">Categorias</strong>
          <p class="mt-1 text-sm text-black/50">{{ filteredCategories.length }} item(ns) encontrado(s)</p>
        </div>
      </template>

      <div class="divide-y divide-black/10">
        <div v-for="category in filteredCategories" :key="category.id" class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
          <div class="grid h-12 w-12 shrink-0 place-items-center rounded-xl" :style="{ backgroundColor: category.color || '#FFC928' }">
            <UIcon :name="category.icon || 'i-lucide-tag'" class="h-5 w-5 text-black" />
          </div>

          <div class="min-w-0 flex-1">
            <strong class="font-black">{{ category.name }}</strong>
            <p class="truncate text-sm text-black/50">{{ category.description || 'Sem descricao' }}</p>
          </div>

          <div class="flex items-center justify-between gap-3 sm:justify-end">
            <UBadge :color="category.active ? 'success' : 'neutral'" variant="soft">
              {{ category.active ? 'Ativa' : 'Inativa' }}
            </UBadge>
            <UDropdownMenu
              :items="[[
                { label: 'Editar', icon: 'i-lucide-pencil', to: `/admin/categorias/${category.id}` },
                { label: 'Apagar', icon: 'i-lucide-trash', color: 'error', onSelect: () => deleting = category }
              ]]"
            >
              <UButton icon="i-lucide-more-horizontal" color="neutral" variant="ghost" aria-label="Acoes" />
            </UDropdownMenu>
          </div>
        </div>
      </div>
    </UCard>

    <UCard v-else class="mt-6 !bg-white text-center">
      <div class="mx-auto max-w-md py-12">
        <UIcon name="i-lucide-tags" class="mx-auto h-12 w-12 text-black/30" />
        <h2 class="mt-4 text-3xl font-black tracking-[-0.06em]">Nenhuma categoria encontrada</h2>
        <p class="mt-2 text-black/55">Crie uma categoria ou limpe os filtros atuais.</p>
        <div class="mt-6 flex justify-center gap-2">
          <UButton to="/admin/categorias/novo" icon="i-lucide-plus">Nova categoria</UButton>
          <UButton color="neutral" variant="soft" @click="search = ''; status = 'todos'">Limpar filtros</UButton>
        </div>
      </div>
    </UCard>

    <AdminDeleteConfirmModal
      :open="Boolean(deleting)"
      :loading="loadingDelete"
      :title="`Apagar ${deleting?.name || 'categoria'}?`"
      @update:open="(value) => { if (!value) deleting = null }"
      @confirm="removeCategory"
    />
  </AdminShell>
</template>
