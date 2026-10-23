import { ref, computed } from 'vue'
import { data } from '@/data'
import { STANCE_COLORS } from '@/constants/stances'
import type { Company, ChartData, Stance, PartialStanceCounts } from '@/types'

export function useCompanyFilters(companies: Company[] = data) {
  const search = ref('')
  const selectedIndustry = ref<string>()
  const selectedStance = ref<Stance>()

  const filteredData = computed<Company[]>(() => {
    const query = search.value.toLowerCase()
    return companies.filter(
      entry =>
        entry.company_name.toLowerCase().includes(query) &&
        (!selectedIndustry.value ||
          entry.industry === selectedIndustry.value) &&
        (!selectedStance.value || entry.stance === selectedStance.value),
    )
  })

  const industries = computed<string[]>(() => [
    ...new Set(companies.map(entry => entry.industry)),
  ])

  const stances = computed<Stance[]>(() => [
    ...new Set(companies.map(entry => entry.stance)),
  ])

  const stancesWithAmount = computed<PartialStanceCounts>(() =>
    filteredData.value.reduce((acc, curr) => {
      acc[curr.stance] = (acc[curr.stance] ?? 0) + 1
      return acc
    }, {} as PartialStanceCounts),
  )

  const pieChartData = computed<ChartData>(() => {
    const labels = Object.keys(stancesWithAmount.value) as Stance[]
    return {
      labels,
      datasets: [
        {
          data: Object.values(stancesWithAmount.value) as number[],
          backgroundColor: labels.map(label => STANCE_COLORS[label]),
        },
      ],
    }
  })

  const resetFields = (): void => {
    selectedIndustry.value = undefined
    selectedStance.value = undefined
    search.value = ''
  }

  return {
    search,
    selectedIndustry,
    selectedStance,
    filteredData,
    industries,
    stances,
    pieChartData,
    resetFields,
  }
}
