<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { usePrefersDark } from '@/composables/usePrefersDark'
import type { ChartData } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend)

defineProps<{
  chartData: ChartData
}>()

const isDarkMode = usePrefersDark()

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
}))
</script>
