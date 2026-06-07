<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
</script>

<template>
  <AdminShell title="Nova categoria" description="Crie uma categoria para organizar o catálogo.">
    <AdminCategoryForm />
  </AdminShell>
</template>
