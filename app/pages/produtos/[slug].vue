<script setup lang="ts">
import type { ProductDTO } from '~~/shared/types'

const route = useRoute()
const { formatMoney } = useMoney()
const { ogLogoUrl, toPublicUrl } = usePublicUrl()

const { data, error } = await useFetch<{ product: ProductDTO, related: ProductDTO[] }>(`/api/products/${route.params.slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Produto nao encontrado.' })
}

const product = computed(() => data.value?.product)
const fallbackImage = '/uploads/seed/caju-editorial-fallback.webp'
const selectedImage = ref(fallbackImage)
const selectedSize = ref('')
const selectedColor = ref('')
const quantity = ref(1)
const buying = ref(false)
const confirmPurchaseOpen = ref(false)
const purchaseError = ref('')

const finalPrice = computed(() => product.value?.promotionalPrice || product.value?.price || 0)
const gallery = computed(() => product.value?.images?.length ? product.value.images : [{ url: fallbackImage, alt: product.value?.name || 'Produto CAJU' }])
const maxQuantity = computed(() => product.value?.stock && product.value.stock > 0 ? product.value.stock : 99)
const publicProductUrl = computed(() => {
  if (!product.value) return ''

  return toPublicUrl(`/produtos/${product.value.slug}`)
})

function imageForColor(color: string) {
  if (!color) return null
  return product.value?.images?.find((image) => image.color === color) || null
}

watch(
  product,
  (nextProduct) => {
    selectedSize.value = nextProduct?.sizes?.[0] || ''
    selectedColor.value = nextProduct?.colors?.[0] || ''
    selectedImage.value = imageForColor(selectedColor.value)?.url || nextProduct?.images?.[0]?.url || fallbackImage
    quantity.value = 1
  },
  { immediate: true }
)

function useFallbackImage(event: Event) {
  const target = event.target as HTMLImageElement
  if (!target.src.endsWith(fallbackImage)) target.src = fallbackImage
}

function setQuantity(value: number) {
  const next = Number.isFinite(value) ? Math.trunc(value) : 1
  quantity.value = Math.min(maxQuantity.value, Math.max(1, next))
}

function onQuantityInput(event: Event) {
  setQuantity(Number((event.target as HTMLInputElement).value))
}

function selectGalleryImage(image: { url: string, color?: string | null }) {
  selectedImage.value = image.url
  if (image.color) selectedColor.value = image.color
}

function selectColor(color: string) {
  selectedColor.value = color

  const matchedImage = imageForColor(color)
  if (matchedImage) selectedImage.value = matchedImage.url
}

async function goHome() {
  await navigateTo('/')
}

function openPurchaseConfirm() {
  if (!product.value) return

  purchaseError.value = ''
  confirmPurchaseOpen.value = true
}

async function buyOnWhatsApp() {
  if (!product.value) return

  buying.value = true
  purchaseError.value = ''

  try {
    const result = await $fetch<{ url: string }>('/api/whatsapp-url', {
      method: 'POST',
      body: {
        productName: product.value.name,
        size: selectedSize.value,
        color: selectedColor.value,
        quantity: Number(quantity.value || 1),
        price: finalPrice.value,
        url: publicProductUrl.value
      }
    })

    confirmPurchaseOpen.value = false

    if (import.meta.client) {
      window.location.href = result.url
      return
    }

    await navigateTo(result.url, { external: true })
  } catch (error: any) {
    purchaseError.value = error?.data?.message || error?.statusMessage || 'Nao foi possivel abrir o WhatsApp. Confira o numero nas configuracoes.'
  } finally {
    buying.value = false
  }
}

useSeoMeta({
  title: () => product.value?.seoTitle || `${product.value?.name || 'Produto'} - CAJU`,
  description: () => product.value?.seoDescription || product.value?.shortDescription || 'Produto autoral da CAJU.',
  ogImage: ogLogoUrl,
  twitterImage: ogLogoUrl
})
</script>

<template>
  <div v-if="product" class="page-shell py-4 sm:py-8">
    <div class="mb-4">
      <button type="button" class="inline-flex cursor-pointer items-center gap-2 text-sm font-black text-black/65" @click="goHome">
        <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
        Voltar
      </button>
    </div>

    <div class="grid items-stretch gap-5 lg:grid-cols-[minmax(0,560px)_minmax(360px,1fr)] lg:gap-6">
      <section class="space-y-3">
        <div class="caju-card overflow-hidden rounded-xl p-2">
          <img
            :src="selectedImage"
            :alt="product.name"
            class="h-auto w-full rounded-lg bg-white object-contain"
            @error="useFallbackImage"
          >
        </div>

        <div v-if="gallery.length > 1" class="flex gap-2 overflow-x-auto pb-2">
          <button
            v-for="image in gallery"
            :key="image.url"
            class="h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-white sm:h-20 sm:w-20"
            :class="selectedImage === image.url ? 'border-[var(--caju-ink)]' : 'border-transparent opacity-70'"
            type="button"
            @click="selectGalleryImage(image)"
          >
            <img :src="image.url" :alt="image.alt || product.name" class="h-full w-full object-cover" @error="useFallbackImage">
          </button>
        </div>
      </section>

      <section class="lg:h-full">
        <div class="caju-card flex h-full flex-col rounded-xl p-4 sm:p-5">
          <p v-if="product.category" class="text-xs font-black uppercase text-black/42">{{ product.category.name }}</p>

          <h1 class="caju-title mt-2 text-2xl sm:text-3xl lg:text-4xl">{{ product.name }}</h1>
          <p class="mt-3 text-sm leading-relaxed text-black/64 sm:text-base">{{ product.description || product.shortDescription }}</p>

          <div class="mt-4 flex items-end gap-3">
            <strong class="text-2xl font-black sm:text-3xl">{{ formatMoney(finalPrice) }}</strong>
            <span v-if="product.promotionalPrice" class="pb-1 text-sm text-black/35 line-through sm:text-base">{{ formatMoney(product.price) }}</span>
          </div>

          <div class="mt-5 grid gap-3">
            <div v-if="product.sizes.length">
              <p class="mb-2 text-xs font-black sm:text-sm">Tamanho</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="sizeOption in product.sizes"
                  :key="sizeOption"
                  type="button"
                  class="cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-black sm:px-3 sm:py-2 sm:text-sm"
                  :class="selectedSize === sizeOption ? 'border-[var(--caju-yellow)] bg-[var(--caju-yellow)] text-black' : 'border-[color:var(--caju-border)] bg-white text-black/70'"
                  @click="selectedSize = sizeOption"
                >
                  {{ sizeOption }}
                </button>
              </div>
            </div>

            <div v-if="product.colors.length">
              <p class="mb-2 text-xs font-black sm:text-sm">Cor / variacao</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="colorOption in product.colors"
                  :key="colorOption"
                  type="button"
                  class="cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-black sm:px-3 sm:py-2 sm:text-sm"
                  :class="selectedColor === colorOption ? 'border-[var(--caju-yellow)] bg-[var(--caju-yellow)] text-black' : 'border-[color:var(--caju-border)] bg-white text-black/70'"
                  @click="selectColor(colorOption)"
                >
                  {{ colorOption }}
                </button>
              </div>
            </div>

            <div>
              <p class="mb-2 text-xs font-black sm:text-sm">Quantidade</p>
              <div class="inline-grid grid-cols-[2.25rem_3.25rem_2.25rem] overflow-hidden rounded-lg border border-[color:var(--caju-border)] bg-white">
                <button type="button" class="grid cursor-pointer place-items-center border-r border-[color:var(--caju-border)]" aria-label="Diminuir quantidade" @click="setQuantity(quantity - 1)">
                  <UIcon name="i-lucide-minus" class="h-4 w-4" />
                </button>
                <input
                  :value="quantity"
                  type="number"
                  min="1"
                  :max="maxQuantity"
                  class="h-10 w-full bg-white text-center text-sm font-black outline-none"
                  @input="onQuantityInput"
                >
                <button type="button" class="grid cursor-pointer place-items-center border-l border-[color:var(--caju-border)]" aria-label="Aumentar quantidade" @click="setQuantity(quantity + 1)">
                  <UIcon name="i-lucide-plus" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <p class="mt-4 rounded-lg border border-[color:var(--caju-border)] bg-[#fffaf3] p-3 text-xs font-medium leading-relaxed text-black/62 sm:text-sm">
            {{ product.stock ? `${product.stock} unidade(s) disponiveis. Confirme os detalhes pelo WhatsApp antes de finalizar.` : 'Disponibilidade sob consulta pelo WhatsApp.' }}
          </p>

          <UButton
            size="lg"
            block
            :loading="buying"
            class="mt-4 font-black"
            icon="i-lucide-message-circle"
            @click="openPurchaseConfirm"
          >
            Comprar pelo WhatsApp
          </UButton>

          <div v-if="product.materials.length" class="mt-4 rounded-xl border border-[color:var(--caju-border)] bg-white p-3 text-xs text-black/62 sm:text-sm">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-shirt" class="mt-0.5 h-5 w-5 text-black/55" />
              <div>
                <strong class="block text-black">Materiais</strong>
                {{ product.materials.join(', ') }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section v-if="data?.related?.length" class="mt-12 sm:mt-16">
      <div class="mb-5">
        <p class="caju-kicker">Continue vendo</p>
        <h2 class="text-2xl font-black sm:text-3xl">Produtos relacionados</h2>
      </div>
      <PublicProductGrid :products="data.related" />
    </section>

    <UModal :open="confirmPurchaseOpen" @update:open="confirmPurchaseOpen = $event">
      <template #content>
        <div class="space-y-5 p-5 sm:p-6">
          <div>
            <p class="caju-kicker">WhatsApp</p>
            <h2 class="mt-1 text-2xl font-black">Confirmar pedido</h2>
            <p class="mt-2 text-sm leading-relaxed text-black/58">
              Vou abrir o WhatsApp com os detalhes abaixo para voce finalizar a compra com a CAJU.
            </p>
          </div>

          <div class="rounded-xl border border-[color:var(--caju-border)] bg-[#fffaf3] p-4">
            <strong class="block text-lg font-black">{{ product.name }}</strong>
            <dl class="mt-3 grid gap-2 text-sm text-black/64 sm:grid-cols-2">
              <div v-if="selectedSize">
                <dt class="text-xs font-black uppercase text-black/42">Tamanho</dt>
                <dd class="font-bold text-black">{{ selectedSize }}</dd>
              </div>
              <div v-if="selectedColor">
                <dt class="text-xs font-black uppercase text-black/42">Cor</dt>
                <dd class="font-bold text-black">{{ selectedColor }}</dd>
              </div>
              <div>
                <dt class="text-xs font-black uppercase text-black/42">Quantidade</dt>
                <dd class="font-bold text-black">{{ quantity }}</dd>
              </div>
              <div>
                <dt class="text-xs font-black uppercase text-black/42">Valor</dt>
                <dd class="font-bold text-black">{{ formatMoney(finalPrice) }}</dd>
              </div>
            </dl>
          </div>

          <UAlert v-if="purchaseError" color="error" variant="soft" icon="i-lucide-circle-alert" :description="purchaseError" />

          <div class="grid gap-2 sm:grid-cols-2">
            <UButton color="neutral" variant="soft" size="lg" block :disabled="buying" @click="confirmPurchaseOpen = false">
              Cancelar
            </UButton>
            <UButton size="lg" block icon="i-lucide-message-circle" :loading="buying" @click="buyOnWhatsApp">
              Abrir WhatsApp
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
