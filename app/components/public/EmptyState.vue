<script setup lang="ts">
withDefaults(
  defineProps<{ title?: string; description?: string; icon?: string }>(),
  {
    title: 'Nenhum resultado',
    description: 'Não encontramos nada com esses filtros.',
    icon: 'i-lucide-package-open'
  }
)
</script>

<template>
  <div class="caju-card rounded-2xl p-12 text-center">
    <UIcon :name="icon" class="mx-auto h-12 w-12 text-black/35" />
    <h3 class="mt-5 text-3xl font-black">{{ title }}</h3>
    <p class="mx-auto mt-2 max-w-md text-black/60">{{ description }}</p>
  </div>
</template>
