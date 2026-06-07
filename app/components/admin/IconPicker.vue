<script setup lang="ts">
const model = defineModel<string>({ default: 'i-lucide-tag' })
const open = ref(false)

const fallbackIcon = { label: 'Categoria', name: 'i-lucide-tag' }
const iconOptions = [
  fallbackIcon,
  { label: 'Camiseta', name: 'i-lucide-shirt' },
  { label: 'Sacola', name: 'i-lucide-shopping-bag' },
  { label: 'Caixa', name: 'i-lucide-package' },
  { label: 'Caneca', name: 'i-lucide-cup-soda' },
  { label: 'Caderno', name: 'i-lucide-notebook-tabs' },
  { label: 'Livro', name: 'i-lucide-book-open' },
  { label: 'Caneta', name: 'i-lucide-pen-line' },
  { label: 'Presente', name: 'i-lucide-gift' },
  { label: 'Destaque', name: 'i-lucide-star' },
  { label: 'Autorais', name: 'i-lucide-sparkles' },
  { label: 'Sol', name: 'i-lucide-sun' },
  { label: 'Praia', name: 'i-lucide-waves' },
  { label: 'Mapa', name: 'i-lucide-map-pin' },
  { label: 'Favorito', name: 'i-lucide-heart' },
  { label: 'Premium', name: 'i-lucide-crown' },
  { label: 'Arte', name: 'i-lucide-palette' },
  { label: 'Natureza', name: 'i-lucide-leaf' },
  { label: 'Local', name: 'i-lucide-anchor' },
  { label: 'Ticket', name: 'i-lucide-ticket' },
  { label: 'Etiqueta', name: 'i-lucide-badge' },
  { label: 'Kit', name: 'i-lucide-box' },
  { label: 'Filtro', name: 'i-lucide-sliders-horizontal' },
  { label: 'Colecao', name: 'i-lucide-layers-3' }
]

const selectedIcon = computed(() => iconOptions.find((item) => item.name === model.value) || fallbackIcon)

function chooseIcon(icon: string) {
  model.value = icon
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
        <span class="grid h-9 w-9 place-items-center rounded-lg bg-[var(--caju-yellow)] text-black">
          <UIcon :name="selectedIcon.name" class="h-5 w-5" />
        </span>
        <span>
          <strong class="block text-sm font-black">{{ selectedIcon.label }}</strong>
          <small class="text-xs text-black/45">Escolher icone</small>
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
              <strong class="block text-lg font-black">Escolher icone</strong>
              <p class="text-sm text-black/50">Selecione uma opcao visual para esta categoria.</p>
            </div>
            <button type="button" class="grid h-9 w-9 place-items-center rounded-lg bg-black/5" aria-label="Fechar" @click="open = false">
              <UIcon name="i-lucide-x" class="h-4 w-4" />
            </button>
          </div>

          <div class="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4">
            <button
              v-for="icon in iconOptions"
              :key="icon.name"
              type="button"
              class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm font-black"
              :class="model === icon.name ? 'border-[var(--caju-yellow)] bg-[#fff7d8]' : 'border-[color:var(--caju-border)] bg-white hover:bg-black/5'"
              @click="chooseIcon(icon.name)"
            >
              <UIcon :name="icon.name" class="h-5 w-5" />
              {{ icon.label }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
