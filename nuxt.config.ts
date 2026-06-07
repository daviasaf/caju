const hasBlobEnvironment = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@nuxt/eslint'],

  ui: {
    colorMode: false
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  compatibilityDate: '2025-07-15',

  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-caju-secret',
    uploadProvider: process.env.UPLOAD_PROVIDER || (hasBlobEnvironment ? 'vercel-blob' : 'local'),
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    blobStoreId: process.env.BLOB_STORE_ID,
    blobWebhookPublicKey: process.env.BLOB_WEBHOOK_PUBLIC_KEY,
    public: {
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'CAJU',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/api/**': { cors: false }
  }
})
