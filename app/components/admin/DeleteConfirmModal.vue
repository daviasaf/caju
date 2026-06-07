<script setup lang="ts">
defineProps<{ open:boolean; title?:string; description?:string; loading?:boolean }>()
const emit=defineEmits<{ 'update:open':[value:boolean]; confirm:[] }>()
</script>
<template><UModal :open="open" @update:open="emit('update:open',$event)"><template #content><div class="space-y-5 p-6"><div><h3 class="text-2xl font-black tracking-[-0.06em]">{{ title || 'Confirmar exclusão' }}</h3><p class="mt-2 text-black/60">{{ description || 'Essa ação não pode ser desfeita.' }}</p></div><div class="flex justify-end gap-2"><UButton color="neutral" variant="soft" @click="emit('update:open',false)">Cancelar</UButton><UButton color="error" :loading="loading" @click="emit('confirm')">Apagar</UButton></div></div></template></UModal></template>
