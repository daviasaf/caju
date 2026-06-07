<script setup lang="ts">
import { productSchema } from '~~/shared/validation'
import type { ProductDTO, CategoryDTO, CollectionDTO } from '~~/shared/types'

const props = defineProps<{ product?: ProductDTO | null }>()
const router = useRouter()
const { success, error } = useAdminAction()

const { data: categories } = await useFetch<CategoryDTO[]>('/api/admin/categories')
const { data: collections } = await useFetch<CollectionDTO[]>('/api/admin/collections')

const NONE_VALUE = '__none__'
const loading = ref(false)
const formError = ref('')

const join = (items?: string[]) => (items || []).join(', ')
const arr = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean)
const isBlank = (value: unknown) => value === '' || value === null || value === undefined
const nullableSelect = (value: string) => value === NONE_VALUE ? null : value

const slugify = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '')

const seoDescription = (value: string) => {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= 155) return text

  return `${text.slice(0, 152).trim()}...`
}

const state = reactive({
  name: props.product?.name || '',
  slug: props.product?.slug || slugify(props.product?.name || ''),
  shortDescription: props.product?.shortDescription || '',
  description: props.product?.description || '',
  price: props.product?.price ?? 0,
  promotionalPrice: props.product?.promotionalPrice ?? null as number | null,
  categoryId: props.product?.categoryId || NONE_VALUE,
  collectionId: props.product?.collectionId || NONE_VALUE,
  images: props.product?.images?.map((image) => image.url) || [] as string[],
  sizesText: join(props.product?.sizes),
  colorsText: join(props.product?.colors),
  materialsText: join(props.product?.materials),
  tagsText: join(props.product?.tags),
  active: props.product?.active ?? true,
  featured: props.product?.featured ?? false,
  stock: props.product?.stock ?? null as number | null,
  order: props.product?.order || 0
})

const categoryItems = computed(() => [
  { label: 'Sem categoria', value: NONE_VALUE },
  ...(categories.value || []).map((item) => ({ label: item.name, value: item.id }))
])

const collectionItems = computed(() => [
  { label: 'Sem colecao', value: NONE_VALUE },
  ...(collections.value || []).map((item) => ({ label: item.name, value: item.id }))
])

watch(() => state.name, (value) => {
  state.slug = slugify(value)
}, { immediate: true })

async function submit() {
  loading.value = true
  formError.value = ''

  try {
    const payload = {
      name: state.name,
      slug: slugify(state.name),
      shortDescription: state.shortDescription,
      description: state.description,
      price: Number(state.price),
      promotionalPrice: isBlank(state.promotionalPrice) ? null : Number(state.promotionalPrice),
      categoryId: nullableSelect(state.categoryId),
      collectionId: nullableSelect(state.collectionId),
      images: state.images,
      sizes: arr(state.sizesText),
      colors: arr(state.colorsText),
      materials: arr(state.materialsText),
      tags: arr(state.tagsText),
      active: state.active,
      featured: state.featured,
      stock: isBlank(state.stock) ? null : Number(state.stock),
      order: Number(state.order || 0),
      seoTitle: state.name ? `${state.name} | CAJU` : null,
      seoDescription: seoDescription(state.shortDescription || state.description || 'Produto autoral da CAJU.')
    }

    if (props.product) {
      await $fetch(`/api/admin/products/${props.product.id}`, { method: 'PUT', body: payload })
      success('Produto atualizado', 'As alteracoes ja estao publicadas na loja.')
    } else {
      await $fetch('/api/admin/products', { method: 'POST', body: payload })
      success('Produto criado', 'O produto ja pode aparecer no catalogo publico.')
    }

    await router.push('/admin/produtos')
  } catch (err: any) {
    formError.value = err?.data?.message || err?.statusMessage || 'Erro ao salvar produto.'
    error('Erro ao salvar', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm
    :schema="productSchema"
    :state="state"
    class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,440px)]"
    @submit="submit"
  >
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
            <strong class="text-xl font-black">Informacoes do produto</strong>
            <p class="mt-1 text-sm text-black/50">Nome, descricao e texto comercial.</p>
          </div>
        </template>

        <div class="grid gap-4">
          <UFormField label="Nome" name="name" required>
            <UInput v-model="state.name" size="lg" placeholder="Camiseta Vista CAJU" />
          </UFormField>

          <UFormField label="Descricao curta" name="shortDescription">
            <UTextarea v-model="state.shortDescription" :rows="3" placeholder="Resumo que aparece nos cards." />
          </UFormField>

          <UFormField label="Descricao completa" name="description">
            <UTextarea v-model="state.description" :rows="7" placeholder="Conte a historia da peca, materiais e detalhes." />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <strong class="text-xl font-black">Imagens</strong>
        </template>
        <AdminImageUploader v-model="state.images" />
      </UCard>
    </div>

    <aside class="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <UCard>
        <template #header>
          <strong class="text-xl font-black">Venda</strong>
        </template>
        <div class="grid gap-4">
          <UFormField label="Preco" name="price" required>
            <UInput v-model="state.price" type="number" step="0.01" />
          </UFormField>
          <UFormField label="Preco promocional" name="promotionalPrice">
            <UInput v-model="state.promotionalPrice" type="number" step="0.01" />
          </UFormField>
          <UFormField label="Estoque" name="stock">
            <UInput v-model="state.stock" type="number" placeholder="Vazio = consultar" />
          </UFormField>
          <UFormField label="Ordem" name="order">
            <UInput v-model="state.order" type="number" />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <strong class="text-xl font-black">Organizacao</strong>
        </template>
        <div class="grid gap-4">
          <UFormField label="Categoria" name="categoryId">
            <USelect v-model="state.categoryId" class="w-full" :items="categoryItems" />
          </UFormField>
          <UFormField label="Colecao" name="collectionId">
            <USelect v-model="state.collectionId" class="w-full" :items="collectionItems" />
          </UFormField>
          <UFormField label="Tamanhos">
            <UInput v-model="state.sizesText" placeholder="P, M, G, GG, G2" />
          </UFormField>
          <UFormField label="Cores / variacoes">
            <UInput v-model="state.colorsText" placeholder="Azul jeans, Vermelho, Off-white" />
          </UFormField>
          <UFormField label="Materiais">
            <UInput v-model="state.materialsText" placeholder="Algodao, malha premium" />
          </UFormField>
          <UFormField label="Tags">
            <UInput v-model="state.tagsText" placeholder="verao, quissama, presente" />
          </UFormField>
        </div>
      </UCard>

      <UCard>
        <div class="space-y-4">
          <UCheckbox v-model="state.active" label="Produto ativo" />
          <UCheckbox v-model="state.featured" label="Destaque na home" />
          <UButton type="submit" block :loading="loading" icon="i-lucide-save">
            Salvar produto
          </UButton>
          <UButton to="/admin/produtos" block color="neutral" variant="soft">
            Cancelar
          </UButton>
        </div>
      </UCard>
    </aside>
  </UForm>
</template>
