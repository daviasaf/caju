<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>()
</script>

<template>
  <NuxtLayout>
    <div class="page-shell grid min-h-[70vh] place-items-center py-16 text-center">
      <div class="caju-card max-w-xl rounded-2xl p-10">
        <p class="text-7xl font-black text-[var(--caju-red)]">{{ error.statusCode || 404 }}</p>
        <h1 class="mt-4 text-4xl font-black">Página não encontrada</h1>
        <p class="mt-3 text-black/60">{{ error.statusMessage || error.message || 'Não encontramos o que você procurava.' }}</p>
        <NuxtLink to="/" class="caju-button caju-button-primary mt-6">
          <UIcon name="i-lucide-home" class="h-5 w-5" />
          Voltar para a home
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
