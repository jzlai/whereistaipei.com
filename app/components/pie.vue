<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { ChartOptions } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { ChartData } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  chartData: ChartData
  options?: ChartOptions<'pie'>
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
})

const isDarkMode = ref(false)

const updateDarkMode = () => {
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

let mediaQuery: MediaQueryList | undefined

onMounted(() => {
  updateDarkMode()
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', updateDarkMode)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', updateDarkMode)
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: isDarkMode.value ? '#f5f5f5' : '#363636',
      },
    },
  },
  ...props.options,
}))
</script>
