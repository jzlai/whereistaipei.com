export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: 'Where is Taipei?',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Tracking how companies refer to Taiwan' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  css: ['@/assets/main.scss'],

  modules: ['@nuxtjs/robots'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:math";`,
          api: 'modern-compiler'
        }
      }
    }
  },

  devtools: { enabled: true },

  compatibilityDate: '2026-02-27'
})
