<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()

const emit = defineEmits<{ menu: [] }>()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-[color:var(--caju-border)] bg-[#fffaf3]">
    <div class="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <UButton
        class="lg:hidden"
        icon="i-lucide-menu"
        color="neutral"
        variant="soft"
        aria-label="Abrir menu"
        @click="emit('menu')"
      />

      <div class="min-w-0">
        <p class="text-xs font-black uppercase text-black/40">Painel CAJU</p>
        <h1 class="truncate text-2xl font-black sm:text-3xl">{{ title }}</h1>
        <p v-if="description" class="mt-1 max-w-2xl text-sm text-black/55">{{ description }}</p>
      </div>
    </div>
  </header>
</template>
