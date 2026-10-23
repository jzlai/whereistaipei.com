import { ref, onMounted, onUnmounted } from 'vue'

export function usePrefersDark() {
  const isDark = ref(false)
  let mediaQuery: MediaQueryList | undefined

  const update = () => {
    isDark.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    update()
    mediaQuery.addEventListener('change', update)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', update)
  })

  return isDark
}
