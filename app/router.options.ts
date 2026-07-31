import type { RouterConfig } from '@nuxt/schema'

interface RouteLike {
  hash: string
}

interface SavedPosition {
  left: number
  top: number
}

export default <RouterConfig>{
  scrollBehavior(
    to: RouteLike,
    _from: RouteLike,
    savedPosition: SavedPosition | null,
  ) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 0 }
    }
    return { top: 0 }
  },
}
