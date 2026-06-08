<script setup lang="ts">
type ImageItem = {
  url: string
  color?: string | null
}

const props = withDefaults(defineProps<{ colors?: string[], objectMode?: boolean }>(), {
  colors: () => [],
  objectMode: false
})

const model = defineModel<any[]>({ default: [] })
const uploading = ref(false)
const uploadingCount = ref(0)
const uploadTotal = ref(0)
const error = ref('')
const toast = useToast()

const NONE_COLOR = '__none__'
const draggingIndex = ref<number | null>(null)
const deletingImage = ref<ImageItem | null>(null)
const colorQueue = ref<ImageItem[]>([])
const colorImage = ref<ImageItem | null>(null)
const colorModalOpen = ref(false)
const selectedColor = ref(NONE_COLOR)

const colorOptions = computed(() => props.colors.map((color) => color.trim()).filter(Boolean))
const hasColorOptions = computed(() => colorOptions.value.length > 0)
const colorItems = computed(() => [
  { label: 'Sem cor especifica', value: NONE_COLOR },
  ...colorOptions.value.map((color) => ({ label: color, value: color }))
])

const images = computed<ImageItem[]>(() => (model.value || [])
  .map((item) => typeof item === 'string'
    ? { url: item, color: null }
    : { url: item.url, color: item.color || null })
  .filter((item) => item.url))

function writeImages(items: ImageItem[]) {
  model.value = props.objectMode || hasColorOptions.value
    ? items.map((item) => ({ url: item.url, color: item.color || null }))
    : items.map((item) => item.url)
}

async function uploadFile(file: File) {
  const form = new FormData()
  form.append('file', file)

  return await $fetch<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    body: form
  })
}

function enqueueColorChoice(items: ImageItem[]) {
  if (!hasColorOptions.value || !items.length) return

  colorQueue.value.push(...items)
  if (!colorModalOpen.value && !colorImage.value) openNextColorChoice()
}

function openNextColorChoice() {
  const next = colorQueue.value.shift()

  if (!next) {
    colorImage.value = null
    colorModalOpen.value = false
    return
  }

  colorImage.value = next
  selectedColor.value = next.color || NONE_COLOR
  colorModalOpen.value = true
}

function closeColorChoice() {
  if (!colorImage.value && !colorModalOpen.value) return

  colorModalOpen.value = false
  colorImage.value = null
  window.setTimeout(openNextColorChoice, 120)
}

function setImageColor(url: string, color: string | null) {
  writeImages(images.value.map((image) => image.url === url ? { ...image, color } : image))
}

function saveColorChoice() {
  if (colorImage.value) {
    setImageColor(colorImage.value.url, selectedColor.value === NONE_COLOR ? null : selectedColor.value)
  }

  closeColorChoice()
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])

  if (!files.length) return

  uploading.value = true
  uploadingCount.value = 0
  uploadTotal.value = files.length
  error.value = ''

  const uploaded: ImageItem[] = []
  const failed: string[] = []

  for (const file of files) {
    try {
      const result = await uploadFile(file)
      const image = { url: result.url, color: null }
      uploaded.push(image)
      uploadingCount.value += 1
      writeImages([...images.value, image])
    } catch (err: any) {
      failed.push(file.name)
      error.value = err?.data?.message || err?.data?.statusMessage || err?.statusMessage || err?.message || 'Nao foi possivel enviar a imagem.'
    }
  }

  if (uploaded.length) {
    toast.add({
      title: uploaded.length === 1 ? 'Imagem enviada' : 'Imagens enviadas',
      description: `${uploaded.length} arquivo(s) otimizado(s) em WebP.`,
      color: 'success'
    })
    enqueueColorChoice(uploaded)
  }

  if (failed.length) {
    error.value = `Falha ao enviar: ${failed.join(', ')}.`
    toast.add({ title: 'Erro no upload', description: error.value, color: 'error' })
  }

  uploading.value = false
  uploadingCount.value = 0
  uploadTotal.value = 0
  input.value = ''
}

function confirmRemoveImage() {
  if (!deletingImage.value) return

  writeImages(images.value.filter((item) => item.url !== deletingImage.value?.url))
  deletingImage.value = null
}

function moveImage(from: number, to: number) {
  if (from === to || from < 0 || to < 0) return

  const next = [...images.value]
  const [item] = next.splice(from, 1)

  if (!item) return

  next.splice(to, 0, item)
  writeImages(next)
}

function onDrop(index: number) {
  if (draggingIndex.value === null) return

  moveImage(draggingIndex.value, index)
  draggingIndex.value = null
}
</script>

<template>
  <div class="space-y-4">
    <label class="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-black/15 bg-white/60 p-8 text-center transition hover:bg-white">
      <UIcon name="i-lucide-upload-cloud" class="h-8 w-8 text-black/40" />
      <span class="mt-3 block font-black">Selecionar imagem</span>
      <span v-if="uploading" class="mt-1 text-sm text-black/50">Enviando {{ uploadingCount }} de {{ uploadTotal }}</span>
      <UProgress v-if="uploading" class="mt-4 w-full max-w-xs" animation="carousel" />
      <input
        class="hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        :disabled="uploading"
        @change="onFileChange"
      >
    </label>

    <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-circle-alert" :description="error" />

    <div v-if="images.length" class="grid gap-3 sm:grid-cols-3">
      <div
        v-for="(image, index) in images"
        :key="image.url"
        draggable="true"
        class="group relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm"
        :class="draggingIndex === index ? 'opacity-60' : ''"
        @dragstart="draggingIndex = index"
        @dragend="draggingIndex = null"
        @dragover.prevent
        @drop="onDrop(index)"
      >
        <img :src="image.url" alt="Imagem enviada" class="aspect-square w-full object-cover">

        <div class="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-white/95 text-xs font-black text-black shadow-sm">
          {{ index + 1 }}
        </div>

        <div class="absolute right-2 top-2 flex gap-1">
          <UButton
            icon="i-lucide-grip"
            color="neutral"
            variant="solid"
            size="xs"
            class="cursor-grab rounded-lg opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"
            aria-label="Arrastar imagem"
          />
          <UButton
            icon="i-lucide-trash"
            color="error"
            variant="solid"
            size="xs"
            class="rounded-lg opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"
            aria-label="Apagar imagem"
            @click.stop="deletingImage = image"
          />
        </div>

        <div v-if="hasColorOptions" class="border-t border-black/10 p-2">
          <USelect
            :model-value="image.color || NONE_COLOR"
            :items="colorItems"
            size="xs"
            class="w-full"
            @update:model-value="(value) => setImageColor(image.url, String(value) === NONE_COLOR ? null : String(value))"
          />
        </div>
      </div>
    </div>

    <UModal :open="colorModalOpen" @update:open="(value) => { if (!value) closeColorChoice() }">
      <template #content>
        <div class="space-y-5 p-6">
          <div>
            <h3 class="text-2xl font-black">Vincular cor</h3>
            <p class="mt-2 text-sm text-black/55">Escolha a variacao desta imagem.</p>
          </div>

          <img v-if="colorImage" :src="colorImage.url" alt="Imagem selecionada" class="aspect-video w-full rounded-xl object-cover">

          <USelect v-model="selectedColor" :items="colorItems" class="w-full" />

          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="soft" @click="closeColorChoice">Pular</UButton>
            <UButton icon="i-lucide-check" @click="saveColorChoice">Salvar</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <AdminDeleteConfirmModal
      :open="Boolean(deletingImage)"
      title="Apagar imagem?"
      description="A imagem sera removida deste cadastro. O produto so muda depois de salvar."
      @update:open="(value) => { if (!value) deletingImage = null }"
      @confirm="confirmRemoveImage"
    />
  </div>
</template>
