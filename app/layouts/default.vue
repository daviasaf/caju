<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden">
    <PublicAppHeader />
    <main class="relative z-10 flex-1">
      <slot />
    </main>
    <PublicAppFooter />
  </div>
</template>
