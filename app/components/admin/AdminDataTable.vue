<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <UCard class="overflow-hidden !bg-white">
    <template v-if="title || description" #header>
      <div>
        <strong v-if="title" class="text-xl font-black tracking-normal">{{ title }}</strong>
        <p v-if="description" class="mt-1 text-sm text-black/50">{{ description }}</p>
      </div>
    </template>

    <div class="overflow-x-auto">
      <slot />
    </div>
  </UCard>
</template>
