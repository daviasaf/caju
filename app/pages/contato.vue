<script setup lang="ts">
import type { StoreSettingsDTO } from '~~/shared/types'

const { ogLogoUrl } = usePublicUrl()
const { data: settings } = await useFetch<StoreSettingsDTO>('/api/settings')
const instagramHref = computed(() => settings.value?.instagram || '')

useSeoMeta({
  title: 'Contato - CAJU',
  description: 'Fale com a CAJU pelo Instagram ou WhatsApp.',
  ogImage: ogLogoUrl,
  twitterImage: ogLogoUrl
})

async function goHome() {
  await navigateTo('/')
}
</script>

<template>
  <div class="page-shell py-8 sm:py-12">
    <button type="button" class="caju-button caju-button-outline mb-8 w-fit px-4" @click="goHome">
      <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
      Voltar
    </button>

    <div class="mx-auto max-w-2xl text-center">
      <p class="caju-kicker">Atendimento</p>
      <h1 class="caju-title mt-3 text-3xl sm:text-5xl">Fale com a CAJU.</h1>
      <p class="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/60 sm:text-base">
        Para duvidas gerais, fale pelo WhatsApp ou acompanhe a CAJU pelo Instagram.
      </p>
      <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <PublicWhatsAppButton label="WhatsApp" size="lg" message="Ola! Vim pelo site da CAJU e quero falar com voces." />
        <UButton
          v-if="instagramHref"
          :to="instagramHref"
          target="_blank"
          size="lg"
          color="neutral"
          variant="outline"
          icon="i-lucide-instagram"
        >
          Instagram
        </UButton>
      </div>
    </div>
  </div>
</template>
