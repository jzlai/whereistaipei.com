export type Stance = 'Taiwan' | 'China' | 'Chinese Taipei' | 'Taiwan ROC' | 'Taiwan Region'

export interface Company {
  company_name: string
  industry: string
  stance: Stance
}

export interface TableColumn {
  field: keyof Company
  label: string
  sortable: boolean
}

export type SortDirection = 'asc' | 'desc'

export interface ChartDataset {
  data: number[]
  backgroundColor: (string | undefined)[]
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}
