<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon?: string
  tone?: string
  description?: string
}>()
</script>

<template>
  <UCard class="overflow-hidden !bg-white">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-black uppercase tracking-normal text-black/45">
          {{ label }}
        </p>

        <strong class="mt-3 block text-4xl font-black tracking-normal">
          {{ value }}
        </strong>

        <p v-if="description" class="mt-2 text-sm text-black/50">
          {{ description }}
        </p>
      </div>

      <div
        class="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
        :style="{ backgroundColor: tone || '#FFC928' }"
      >
        <UIcon :name="icon || 'i-lucide-activity'" class="h-6 w-6 text-black" />
      </div>
    </div>
  </UCard>
</template>
