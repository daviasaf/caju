<script setup lang="ts">
import type { CategoryDTO } from '~~/shared/types'
definePageMeta({layout:'admin',middleware:'admin'})
const route=useRoute();const {data:category,pending}=await useFetch<CategoryDTO>(`/api/admin/categories/${route.params.id}`)
</script>
<template><AdminShell title="Editar categoria" :description="category?.name"><USkeleton v-if="pending" class="h-80 rounded-[1.75rem]" /><AdminCategoryForm v-else-if="category" :category="category" /></AdminShell></template>
