<script setup lang="ts">
import type { CollectionDTO } from '~~/shared/types'
const {data:collections,pending}=await useFetch<CollectionDTO[]>('/api/collections')
useSeoMeta({title:'Coleções — CAJU',description:'Coleções autorais da CAJU inspiradas em Quissamã.'})
</script>
<template><div class="page-shell py-12"><div class="mb-10"><p class="font-black uppercase tracking-[0.2em] text-black/40">Drops e histórias</p><h1 class="caju-title mt-2 text-6xl md:text-8xl">Coleções</h1><p class="mt-4 max-w-2xl text-lg text-black/60">Cada coleção carrega uma cor, uma memória e um pedaço de Quissamã.</p></div><div v-if="pending" class="grid gap-6 md:grid-cols-3"><USkeleton v-for="item in 6" :key="item" class="h-80 rounded-[2rem]" /></div><div v-else class="grid gap-6 md:grid-cols-3"><PublicCollectionCard v-for="collection in collections" :key="collection.id" :collection="collection" /></div></div></template>
