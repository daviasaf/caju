<script setup lang="ts">
const model = defineModel<string>({ default: '#FFC928' })
const open = ref(false)

const colorOptions = [
  { label: 'Amarelo CAJU', value: '#FFC928' },
  { label: 'Azul jeans', value: '#385A6F' },
  { label: 'Azul vivo', value: '#028CE8' },
  { label: 'Vermelho', value: '#D71920' },
  { label: 'Oliva', value: '#6D7A3B' },
  { label: 'Laranja', value: '#F47C20' },
  { label: 'Areia', value: '#EAD8A6' },
  { label: 'Off-white', value: '#F8F3E7' },
  { label: 'Grafite', value: '#263039' },
  { label: 'Preto suave', value: '#172026' },
  { label: 'Verde folha', value: '#3F7D58' },
  { label: 'Verde agua', value: '#8BC6B8' },
  { label: 'Azul mar', value: '#1D6F93' },
  { label: 'Azul claro', value: '#86CDEB' },
  { label: 'Terracota', value: '#B66A4B' },
  { label: 'Coral', value: '#F06C64' },
  { label: 'Rosa seco', value: '#D99AA5' },
  { label: 'Vinho', value: '#7A2E3A' },
  { label: 'Roxo discreto', value: '#6554A8' },
  { label: 'Lavanda', value: '#B9A6D8' },
  { label: 'Mostarda', value: '#C89B1F' },
  { label: 'Nude', value: '#D6BFA8' },
  { label: 'Cinza claro', value: '#D8DCE0' },
  { label: 'Cinza medio', value: '#87919A' }
]

const selectedColor = computed(() => colorOptions.find((item) => item.value.toLowerCase() === model.value?.toLowerCase()))
const selectedLabel = computed(() => selectedColor.value?.label || 'Cor selecionada')

function chooseColor(color: string) {
  model.value = color
  open.value = false
}
</script>

<template>
  <div>
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-[color:var(--caju-border)] bg-white px-3 py-2.5 text-left"
      @click="open = true"
    >
      <span class="flex items-center gap-3">
        <span class="h-9 w-9 rounded-lg border border-black/10" :style="{ backgroundColor: model }" />
        <span>
          <strong class="block text-sm font-black">{{ selectedLabel }}</strong>
          <small class="text-xs text-black/45">Escolher cor</small>
        </span>
      </span>
      <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-black/45" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4"
        role="dialog"
        aria-modal="true"
        @click.self="open = false"
      >
        <div class="max-h-[86vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
          <div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <div>
              <strong class="block text-lg font-black">Escolher cor</strong>
              <p class="text-sm text-black/50">Use uma cor pronta para manter o visual padronizado.</p>
            </div>
            <button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-black/5" aria-label="Fechar" @click="open = false">
              <UIcon name="i-lucide-x" class="h-4 w-4" />
            </button>
          </div>

          <div class="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm font-black"
              :class="model?.toLowerCase() === color.value.toLowerCase() ? 'border-[var(--caju-yellow)] bg-[#fff7d8]' : 'border-[color:var(--caju-border)] bg-white hover:bg-black/5'"
              @click="chooseColor(color.value)"
            >
              <span class="h-6 w-6 shrink-0 rounded-md border border-black/10" :style="{ backgroundColor: color.value }" />
              {{ color.label }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
