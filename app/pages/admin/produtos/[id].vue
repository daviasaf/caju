<script setup lang="ts">
import type { ProductDTO } from '~~/shared/types'
definePageMeta({layout:'admin',middleware:'admin'})
const route=useRoute();const {data:product,pending}=await useFetch<ProductDTO>(`/api/admin/products/${route.params.id}`)
</script>
<template><AdminShell title="Editar produto" :description="product ? `Ajustando ${product.name}` : 'Carregando produto...'"><USkeleton v-if="pending" class="h-96 rounded-[1.75rem]" /><AdminProductForm v-else-if="product" :product="product" /></AdminShell></template>
