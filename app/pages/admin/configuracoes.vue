<script setup lang="ts">
import { settingsSchema } from '~~/shared/validation'
import type { ProductDTO, CollectionDTO, StoreSettingsDTO } from '~~/shared/types'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { success, error } = useAdminAction()
const { data: settings, refresh } = await useFetch<StoreSettingsDTO>('/api/settings')
const { data: products } = await useFetch<ProductDTO[]>('/api/admin/products')
const { data: collections } = await useFetch<CollectionDTO[]>('/api/admin/collections')

const loading = ref(false)
const formError = ref('')
const NONE_VALUE = '__none__'

const state = reactive({
  storeName: '',
  whatsappNumber: '',
  instagram: '',
  city: '',
  state: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  featuredProductId: '',
  featuredCollectionId: '',
  paymentText: '',
  shippingText: '',
  seoTitle: '',
  seoDescription: ''
})

watchEffect(() => {
  if (!settings.value) return

  Object.assign(state, {
    storeName: settings.value.storeName || 'CAJU',
    whatsappNumber: settings.value.whatsappNumber || '',
    instagram: settings.value.instagram || '',
    city: settings.value.city || '',
    state: settings.value.state || '',
    heroTitle: settings.value.heroTitle || '',
    heroSubtitle: settings.value.heroSubtitle || '',
    heroImage: settings.value.heroImage || '',
    featuredProductId: settings.value.featuredProductId || NONE_VALUE,
    featuredCollectionId: settings.value.featuredCollectionId || NONE_VALUE,
    paymentText: settings.value.paymentText || '',
    shippingText: settings.value.shippingText || '',
    seoTitle: settings.value.seoTitle || '',
    seoDescription: settings.value.seoDescription || ''
  })
})

const images = computed({
  get: () => state.heroImage ? [state.heroImage] : [],
  set: (value: string[]) => { state.heroImage = value[0] || '' }
})

const productItems = computed(() => [
  { label: 'Nenhum', value: NONE_VALUE },
  ...(products.value || []).map((item) => ({ label: item.name, value: item.id }))
])

const collectionItems = computed(() => [
  { label: 'Nenhuma', value: NONE_VALUE },
  ...(collections.value || []).map((item) => ({ label: item.name, value: item.id }))
])

const previewProduct = computed(() => state.featuredProductId === NONE_VALUE ? null : (products.value || []).find((item) => item.id === state.featuredProductId))
const previewCollection = computed(() => state.featuredCollectionId === NONE_VALUE ? null : (collections.value || []).find((item) => item.id === state.featuredCollectionId))
const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}

async function submit() {
  loading.value = true
  formError.value = ''

  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: {
        ...state,
        featuredProductId: state.featuredProductId === NONE_VALUE ? '' : state.featuredProductId,
        featuredCollectionId: state.featuredCollectionId === NONE_VALUE ? '' : state.featuredCollectionId
      }
    })
    success('Configurações salvas', 'A home pública já usa os destaques selecionados.')
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.message || err?.statusMessage || 'Erro ao salvar configurações.'
    error('Erro ao salvar', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminShell title="Configurações" description="Controle textos, WhatsApp, SEO e destaques da loja.">
    <UForm :schema="settingsSchema" :state="state" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,440px)]" @submit="submit">
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
            <strong class="text-xl font-black tracking-[-0.05em]">Dados da loja</strong>
          </template>
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <UFormField label="Nome" name="storeName"><UInput v-model="state.storeName" /></UFormField>
            <UFormField label="WhatsApp" name="whatsappNumber"><UInput v-model="state.whatsappNumber" /></UFormField>
            <UFormField label="Instagram" name="instagram"><UInput v-model="state.instagram" /></UFormField>
            <UFormField label="Cidade" name="city"><UInput v-model="state.city" /></UFormField>
            <UFormField label="Estado" name="state"><UInput v-model="state.state" /></UFormField>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <strong class="text-xl font-black tracking-[-0.05em]">Hero e banners</strong>
          </template>
          <div class="grid gap-4">
            <UFormField label="Título" name="heroTitle"><UInput v-model="state.heroTitle" /></UFormField>
            <UFormField label="Subtítulo" name="heroSubtitle"><UTextarea v-model="state.heroSubtitle" :rows="4" /></UFormField>
            <UFormField label="Imagem principal" name="heroImage"><AdminImageUploader v-model="images" /></UFormField>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <strong class="text-xl font-black tracking-[-0.05em]">SEO padrão</strong>
          </template>
          <div class="grid gap-4">
            <UFormField label="SEO title" name="seoTitle"><UInput v-model="state.seoTitle" /></UFormField>
            <UFormField label="SEO description" name="seoDescription"><UTextarea v-model="state.seoDescription" :rows="3" /></UFormField>
          </div>
        </UCard>
      </div>

      <aside class="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <UCard>
          <template #header>
            <strong class="text-xl font-black tracking-[-0.05em]">Destaques da home</strong>
          </template>
          <div class="grid gap-4">
            <UFormField label="Produto destaque" name="featuredProductId">
              <USelect v-model="state.featuredProductId" class="w-full" :items="productItems" />
            </UFormField>
            <UFormField label="Coleção destaque" name="featuredCollectionId">
              <USelect v-model="state.featuredCollectionId" class="w-full" :items="collectionItems" />
            </UFormField>
            <UFormField label="Pagamento" name="paymentText">
              <UTextarea v-model="state.paymentText" :rows="3" />
            </UFormField>
            <UFormField label="Envio" name="shippingText">
              <UTextarea v-model="state.shippingText" :rows="3" />
            </UFormField>
            <UButton type="submit" block :loading="loading" icon="i-lucide-save">
              Salvar configurações
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <strong class="text-xl font-black tracking-[-0.05em]">Preview rápido</strong>
          </template>
          <div class="space-y-4">
            <div class="overflow-hidden rounded-2xl border border-[color:var(--caju-border)] bg-white text-[var(--caju-ink)]">
              <img :src="state.heroImage || previewProduct?.images?.[0]?.url || fallbackImage" alt="Preview hero" class="aspect-video w-full object-cover" @error="useFallbackImage">
              <div class="p-4">
                <p class="text-xs font-black uppercase tracking-normal text-black/45">Hero</p>
                <strong class="mt-1 block text-2xl font-black tracking-[-0.07em]">{{ state.heroTitle || 'Vista Quissamã.' }}</strong>
              </div>
            </div>
            <p class="text-sm text-black/55">
              Produto: <strong>{{ previewProduct?.name || 'automático' }}</strong><br>
              Coleção: <strong>{{ previewCollection?.name || 'automática' }}</strong>
            </p>
          </div>
        </UCard>
      </aside>
    </UForm>
  </AdminShell>
</template>
