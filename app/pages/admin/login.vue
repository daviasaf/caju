<script setup lang="ts">
import { loginSchema } from '~~/shared/validation'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const { success, error } = useAdminAction()
const state = reactive({ password: '' })
const loading = ref(false)
const formError = ref('')

async function submit() {
  loading.value = true
  formError.value = ''

  try {
    await $fetch('/api/admin/login', { method: 'POST', body: state })
    success('Bem-vindo ao admin da CAJU')
    await router.push('/admin')
  } catch (err: any) {
    formError.value = err?.data?.message || err?.statusMessage || 'Senha inválida.'
    error('Senha inválida', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid min-h-screen place-items-center p-4">
    <UCard class="w-full max-w-md !bg-white">
      <div class="mb-8 text-center">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--caju-yellow)] text-4xl font-black">C</div>
        <h1 class="mt-5 text-4xl font-black tracking-normal">CAJU Admin</h1>
        <p class="mt-2 text-black/55">Entre para gerenciar produtos, coleções e configurações.</p>
      </div>

      <UAlert v-if="formError" class="mb-4" color="error" variant="soft" icon="i-lucide-circle-alert" :description="formError" />

      <UForm :schema="loginSchema" :state="state" class="space-y-4" @submit="submit">
        <UFormField label="Senha do admin" name="password">
          <UInput v-model="state.password" type="password" size="lg" placeholder="ADMIN_PASSWORD" />
        </UFormField>
        <UButton type="submit" block size="lg" :loading="loading" icon="i-lucide-lock-keyhole">
          Entrar
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
