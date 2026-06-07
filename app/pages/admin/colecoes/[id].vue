<script setup lang="ts">
import type { CollectionDTO } from '~~/shared/types'
definePageMeta({layout:'admin',middleware:'admin'})
const route=useRoute();const {data:collection,pending}=await useFetch<CollectionDTO>(`/api/admin/collections/${route.params.id}`)
</script>
<template><AdminShell title="Editar coleção" :description="collection?.name"><USkeleton v-if="pending" class="h-96 rounded-[1.75rem]" /><AdminCollectionForm v-else-if="collection" :collection="collection" /></AdminShell></template>
