import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

export default defineNuxtPlugin(() => {
  inject({ framework: 'nuxt' })
  injectSpeedInsights({ framework: 'nuxt' })
})
