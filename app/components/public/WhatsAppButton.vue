<script setup lang="ts">
const props = withDefaults(defineProps<{ label?: string; message?: string; size?: 'xs'|'sm'|'md'|'lg'|'xl'; variant?: 'solid'|'outline'|'soft'|'ghost' }>(), { label:'WhatsApp', message:'Olá! Vim pelo site da CAJU e quero saber mais sobre os produtos.', size:'md', variant:'solid' })
const { data: settings } = await useFetch('/api/settings')
const href = computed(() => `https://wa.me/${String(settings.value?.whatsappNumber || '5522981124709').replace(/\D/g,'')}?text=${encodeURIComponent(props.message)}`)
</script>
<template><UButton :to="href" target="_blank" icon="i-lucide-message-circle" :size="size" :variant="variant" class="font-black">{{ label }}</UButton></template>
