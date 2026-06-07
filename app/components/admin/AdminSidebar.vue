<script setup lang="ts">
defineProps<{ mobile?: boolean }>()

const emit = defineEmits<{ close: [] }>()
const route = useRoute()

const links = [
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard' },
  { label: 'Produtos', to: '/admin/produtos', icon: 'i-lucide-shopping-bag' },
  { label: 'Categorias', to: '/admin/categorias', icon: 'i-lucide-tags' },
  { label: 'Coleções', to: '/admin/colecoes', icon: 'i-lucide-layers-3' },
  { label: 'Configurações', to: '/admin/configuracoes', icon: 'i-lucide-settings' }
]

function isActive(to: string) {
  return route.path === to || (to !== '/admin' && route.path.startsWith(`${to}/`))
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  emit('close')
  await navigateTo('/admin/login')
}
</script>

<template>
  <aside class="flex h-full flex-col border-r border-[color:var(--caju-border)] bg-[var(--caju-off)] p-4">
    <div class="mb-7 flex items-center justify-between gap-3">
      <NuxtLink
        to="/admin"
        class="flex min-w-0 items-center gap-3 px-1 py-2 text-[var(--caju-ink)]"
        @click="emit('close')"
      >
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--caju-yellow)] text-xl font-black text-black">C</span>
        <div class="min-w-0">
          <strong class="block truncate text-lg font-black tracking-normal">CAJU Admin</strong>
          <small class="text-black/50">painel da loja</small>
        </div>
      </NuxtLink>

      <button
        v-if="mobile"
        type="button"
        class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[color:var(--caju-border)] bg-white text-black/70"
        aria-label="Fechar menu"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" class="h-4 w-4" />
      </button>
    </div>

    <nav class="grid gap-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-black text-black/65"
        :class="isActive(link.to) ? 'bg-[var(--caju-yellow)] text-black' : 'hover:bg-white'"
        @click="emit('close')"
      >
        <UIcon :name="link.icon" class="h-5 w-5" />
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="mt-auto grid gap-2 pt-8">
      <UButton to="/" target="_blank" color="neutral" variant="soft" icon="i-lucide-external-link" block>
        Ver loja
      </UButton>
      <UButton color="error" variant="soft" icon="i-lucide-log-out" block @click="logout">
        Sair
      </UButton>
    </div>
  </aside>
</template>
