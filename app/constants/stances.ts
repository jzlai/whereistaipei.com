import type { Stance } from '@/types'

/**
 * Color mapping for different stance values
 * Used for consistent coloring across charts and UI
 */
export const STANCE_COLORS: Record<Stance, string> = {
  China: '#F7464A',
  Taiwan: '#018002',
  'Chinese Taipei': '#FDB45C',
  'Taiwan ROC': '#949FB1',
  'Taiwan Region': '#4D5360',
} as const
