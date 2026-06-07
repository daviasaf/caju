<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
    <AdminSidebar class="sticky top-0 hidden h-screen lg:flex" />

    <Teleport to="body">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
        <button
          type="button"
          class="absolute inset-0 bg-black/35"
          aria-label="Fechar menu"
          @click="mobileMenuOpen = false"
        />
        <div class="relative h-full w-[min(84vw,320px)] bg-[var(--caju-off)] shadow-2xl">
          <AdminSidebar class="h-full" mobile @close="mobileMenuOpen = false" />
        </div>
      </div>
    </Teleport>

    <div class="min-w-0">
      <AdminHeader :title="title" :description="description" @menu="mobileMenuOpen = true" />

      <main class="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>
