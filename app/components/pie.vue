<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  chartData: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
})

const isDarkMode = ref(false)

const updateDarkMode = () => {
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

onMounted(() => {
  updateDarkMode()
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', updateDarkMode)
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', updateDarkMode)
  })
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
