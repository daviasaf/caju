<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-[#fffaf3]">
    <PublicAppHeader />
    <main class="relative z-10 flex-1 bg-[#fffaf3]">
      <slot />
    </main>
    <PublicAppFooter />
  </div>
</template>
