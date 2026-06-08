<script setup lang="ts">
const { ogLogoUrl } = usePublicUrl()

useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})

useSeoMeta({
  ogSiteName: 'CAJU',
  ogType: 'website',
  ogImage: ogLogoUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  twitterCard: 'summary_large_image',
  twitterImage: ogLogoUrl
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
