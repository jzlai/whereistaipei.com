export default defineNuxtConfig({
  ssr: true,

  app: {
    head: {
      title: 'Where is Taipei?',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Tracking how companies refer to Taiwan',
        },
        { property: 'og:title', content: 'Where is Taipei?' },
        {
          property: 'og:description',
          content: 'Tracking how companies refer to Taiwan',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://whereistaipei.com/' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [
        { rel: 'canonical', href: 'https://whereistaipei.com/' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['@/assets/main.scss'],

  modules: ['@nuxtjs/robots'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:math";`,
        },
      },
    },
  },

  devtools: { enabled: false },

  compatibilityDate: '2026-02-27',
})
