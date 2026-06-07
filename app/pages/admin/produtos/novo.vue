<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminShell title="Novo produto" description="Cadastre uma nova peça ou produto CAJU.">
    <AdminProductForm />
  </AdminShell>
</template>
