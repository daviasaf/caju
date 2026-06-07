<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminShell title="Nova coleção" description="Crie um drop com cor e narrativa própria.">
    <AdminCollectionForm />
  </AdminShell>
</template>
