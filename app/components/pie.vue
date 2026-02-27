<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  chartData: { type: Object, required: true },
  options: { type: Object, default: () => ({}) }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  ...props.options
}))
</script>
