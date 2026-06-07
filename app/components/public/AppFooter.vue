<script setup lang="ts">
import type { StoreSettingsDTO } from '~~/shared/types'

const year = new Date().getFullYear()
const { data: settings } = await useFetch<StoreSettingsDTO>('/api/settings')

const whatsappHref = computed(() => {
  const phone = String(settings.value?.whatsappNumber || '').replace(/\D/g, '')
  if (!phone) return ''

  return `https://wa.me/${phone}?text=${encodeURIComponent('Ola! Vim pelo site da CAJU e quero falar com voces.')}`
})
</script>

<template>
  <footer class="relative z-10 border-t border-black/10 bg-[var(--caju-ink)] text-white">
    <div class="page-shell grid gap-8 py-10 text-center md:grid-cols-[1.4fr_.8fr_.8fr] md:text-left">
      <div>
        <strong class="text-4xl font-black text-[var(--caju-yellow)] sm:text-5xl">CAJU</strong>
        <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base md:mx-0">
          Feito em Quissama, para circular pelo Brasil. Produtos autorais com praia, rua, natureza e memoria local.
        </p>
      </div>

      <div>
        <h3 class="font-black uppercase text-white/50">Loja</h3>
        <div class="mt-4 grid justify-items-center gap-2 text-sm text-white/75 md:justify-items-start">
          <NuxtLink to="/">Produtos</NuxtLink>
          <NuxtLink to="/contato">Contato</NuxtLink>
        </div>
      </div>

      <div>
        <h3 class="font-black uppercase text-white/50">Contato</h3>
        <p class="mt-4 text-sm text-white/75">{{ settings?.city || 'Quissama' }} - {{ settings?.state || 'RJ' }}</p>
        <NuxtLink
          v-if="settings?.instagram"
          :to="settings.instagram"
          target="_blank"
          class="mx-auto mt-3 flex w-fit items-center gap-2 text-sm font-bold text-white/80 md:mx-0"
        >
          <UIcon name="i-lucide-instagram" class="h-4 w-4" />
          Instagram
        </NuxtLink>
        <NuxtLink
          v-if="whatsappHref"
          :to="whatsappHref"
          target="_blank"
          class="mx-auto mt-3 flex w-fit items-center gap-2 text-sm font-bold text-white/80 md:mx-0"
        >
          <UIcon name="i-lucide-message-circle" class="h-4 w-4" />
          WhatsApp
        </NuxtLink>
      </div>
    </div>
    <div class="border-t border-white/10 py-4 text-center text-xs font-bold uppercase text-white/40">
      &copy; {{ year }} CAJU
    </div>
  </footer>
</template>
