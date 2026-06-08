<script setup lang="ts">
const { ogLogoUrl } = usePublicUrl()

useSeoMeta({
  title: 'Sobre - CAJU',
  description: 'Conheca a CAJU, marca autoral feita em Quissama - RJ.',
  ogImage: ogLogoUrl,
  twitterImage: ogLogoUrl
})
</script>

<template>
  <div class="page-shell py-16">
    <div class="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
      <div>
        <p class="caju-kicker">Sobre a marca</p>
        <h1 class="caju-title mt-3 text-5xl md:text-7xl">CAJU e territorio.</h1>
      </div>
      <div class="caju-card rounded-xl p-8 text-xl leading-relaxed text-black/65">
        <p>A CAJU nasce em Quissama - RJ para transformar memoria local em produtos autorais: camisetas, regatas, bones, canecas, papelaria e kits com identidade regional.</p>
        <p class="mt-5">A marca trabalha referencias de praia, natureza, restinga, Baoba, Jurubatiba, rua e orgulho local com uma linguagem limpa, contemporanea e facil de usar no dia a dia.</p>
      </div>
    </div>
  </div>
</template>
