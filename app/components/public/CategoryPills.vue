<script setup lang="ts">
import type { CategoryDTO } from '~~/shared/types'

defineProps<{ categories?: CategoryDTO[] | null }>()
</script>

<template>
  <div class="flex gap-3 overflow-x-auto pb-2">
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/?category=${category.slug}`"
      class="shrink-0 rounded-full border bg-white px-5 py-3 text-sm font-black"
      :style="{ borderColor: category.color || '#FFC928' }"
    >
      {{ category.name }}
    </NuxtLink>
  </div>
</template>
