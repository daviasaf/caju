<script setup lang="ts">
import { categorySchema } from '~~/shared/validation'
import type { CategoryDTO } from '~~/shared/types'

const props = defineProps<{ category?: CategoryDTO | null }>()
const router = useRouter()
const { success, error } = useAdminAction()
const loading = ref(false)
const formError = ref('')

const slugify = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '')

const state = reactive({
  name: props.category?.name || '',
  slug: props.category?.slug || slugify(props.category?.name || ''),
  description: props.category?.description || '',
  color: props.category?.color || '#FFC928',
  icon: props.category?.icon || 'i-lucide-tag',
  active: props.category?.active ?? true,
  order: props.category?.order || 0
})

watch(() => state.name, (value) => {
  state.slug = slugify(value)
}, { immediate: true })

async function submit() {
  loading.value = true
  formError.value = ''

  try {
    const payload = {
      ...state,
      slug: slugify(state.name),
      order: Number(state.order || 0)
    }

    if (props.category) {
      await $fetch(`/api/admin/categories/${props.category.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/categories', { method: 'POST', body: payload })
    }

    success('Categoria salva')
    await router.push('/admin/categorias')
  } catch (err: any) {
    formError.value = err?.data?.message || err?.statusMessage || 'Erro ao salvar categoria.'
    error('Erro ao salvar', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm :schema="categorySchema" :state="state" class="space-y-6" @submit="submit">
    <UAlert
      v-if="formError"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      :description="formError"
    />

    <UCard>
      <template #header>
        <div>
          <strong class="text-xl font-black tracking-[-0.05em]">Categoria</strong>
          <p class="mt-1 text-sm text-black/50">Organize o catalogo com cor e icone padronizados.</p>
        </div>
      </template>

      <div class="grid gap-4">
        <UFormField label="Nome" name="name" required>
          <UInput v-model="state.name" size="lg" />
        </UFormField>

        <UFormField label="Descricao" name="description">
          <UTextarea v-model="state.description" :rows="4" />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-3">
          <UFormField label="Cor" name="color">
            <AdminColorPicker v-model="state.color" />
          </UFormField>
          <UFormField label="Icone" name="icon">
            <AdminIconPicker v-model="state.icon" />
          </UFormField>
          <UFormField label="Ordem" name="order">
            <UInput v-model="state.order" type="number" />
          </UFormField>
        </div>

        <UCheckbox v-model="state.active" label="Categoria ativa" />
      </div>
    </UCard>

    <div class="flex flex-col gap-2 sm:flex-row">
      <UButton type="submit" :loading="loading" icon="i-lucide-save">
        Salvar categoria
      </UButton>
      <UButton to="/admin/categorias" color="neutral" variant="soft">
        Cancelar
      </UButton>
    </div>
  </UForm>
</template>
