<script setup lang="ts">
import { collectionSchema } from '~~/shared/validation'
import type { CollectionDTO } from '~~/shared/types'

const props = defineProps<{ collection?: CollectionDTO | null }>()
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
  name: props.collection?.name || '',
  slug: props.collection?.slug || slugify(props.collection?.name || ''),
  description: props.collection?.description || '',
  image: props.collection?.image || '',
  highlightColor: props.collection?.highlightColor || '#FFC928',
  active: props.collection?.active ?? true,
  featured: props.collection?.featured ?? false,
  order: props.collection?.order || 0
})

const images = computed({
  get: () => state.image ? [state.image] : [],
  set: (value: string[]) => { state.image = value[0] || '' }
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

    if (props.collection) {
      await $fetch(`/api/admin/collections/${props.collection.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/collections', { method: 'POST', body: payload })
    }

    success('Colecao salva', state.featured ? 'Ela esta definida como destaque da home.' : undefined)
    await router.push('/admin/colecoes')
  } catch (err: any) {
    formError.value = err?.data?.message || err?.statusMessage || 'Erro ao salvar colecao.'
    error('Erro ao salvar', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm :schema="collectionSchema" :state="state" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]" @submit="submit">
    <div class="space-y-6">
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
            <strong class="text-xl font-black tracking-[-0.05em]">Colecao</strong>
            <p class="mt-1 text-sm text-black/50">Crie drops e destaques para a loja.</p>
          </div>
        </template>

        <div class="grid gap-4">
          <UFormField label="Nome" name="name" required>
            <UInput v-model="state.name" />
          </UFormField>

          <UFormField label="Descricao" name="description">
            <UTextarea v-model="state.description" :rows="5" />
          </UFormField>

          <UFormField label="Imagem" name="image">
            <AdminImageUploader v-model="images" />
          </UFormField>
        </div>
      </UCard>
    </div>

    <aside class="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <UCard>
        <template #header>
          <strong class="text-xl font-black tracking-[-0.05em]">Aparencia e status</strong>
        </template>

        <div class="grid gap-4">
          <UFormField label="Cor de destaque" name="highlightColor">
            <AdminColorPicker v-model="state.highlightColor" />
          </UFormField>
          <UFormField label="Ordem" name="order">
            <UInput v-model="state.order" type="number" />
          </UFormField>
          <UCheckbox v-model="state.active" label="Colecao ativa" />
          <UCheckbox v-model="state.featured" label="Destacar na home" />
          <UButton type="submit" block :loading="loading" icon="i-lucide-save">
            Salvar colecao
          </UButton>
          <UButton to="/admin/colecoes" block color="neutral" variant="soft">
            Cancelar
          </UButton>
        </div>
      </UCard>
    </aside>
  </UForm>
</template>
