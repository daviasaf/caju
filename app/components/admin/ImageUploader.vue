<script setup lang="ts">
const model = defineModel<string[]>({ default: [] })
const uploading = ref(false)
const error = ref('')
const toast = useToast()

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const form = new FormData()
  form.append('file', file)
  uploading.value = true
  error.value = ''

  try {
    const result = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body: form
    })

    model.value = [...model.value, result.url]
    toast.add({ title: 'Imagem enviada', description: 'Arquivo otimizado em WebP.', color: 'success' })
  } catch (err: any) {
    error.value = err?.data?.message || err?.statusMessage || 'Não foi possível enviar a imagem.'
    toast.add({ title: 'Erro no upload', description: error.value, color: 'error' })
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function removeImage(url: string) {
  model.value = model.value.filter((item) => item !== url)
}
</script>

<template>
  <div class="space-y-4">
    <label class="grid cursor-pointer place-items-center rounded-[1.5rem] border-2 border-dashed border-black/15 bg-white/60 p-8 text-center transition hover:bg-white">
      <UIcon name="i-lucide-upload-cloud" class="h-8 w-8 text-black/40" />
      <span class="mt-3 block font-black">Selecionar imagem</span>
      <span class="text-sm text-black/50">JPG, PNG ou WebP até 5MB. O arquivo sai otimizado em WebP.</span>
      <UProgress v-if="uploading" class="mt-4 w-full max-w-xs" animation="carousel" />
      <input
        class="hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        :disabled="uploading"
        @change="onFileChange"
      >
    </label>

    <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-circle-alert" :description="error" />

    <div v-if="model.length" class="grid gap-3 sm:grid-cols-3">
      <div v-for="url in model" :key="url" class="group relative overflow-hidden rounded-2xl border border-black/10 bg-white">
        <img :src="url" alt="Imagem enviada" class="aspect-square w-full object-cover">
        <UButton
          icon="i-lucide-trash"
          color="error"
          variant="solid"
          size="xs"
          class="absolute right-2 top-2 rounded-full opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"
          @click="removeImage(url)"
        />
      </div>
    </div>
  </div>
</template>
