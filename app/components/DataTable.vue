<template>
  <div class="data-table">
    <table class="table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            @click="column.sortable ? toggleSort(column.field) : null"
            :style="column.sortable ? 'cursor: pointer;' : ''"
          >
            {{ column.label }}
            <span v-if="column.sortable && sortField === column.field">
              <SvgIcon
                :path="sortDirection === 'asc' ? mdiChevronUp : mdiChevronDown"
                :size="16"
              />
            </span>
          </th>
        </tr>
      </thead>
      <tbody v-if="paginatedData.length > 0">
        <tr v-for="(row, index) in paginatedData" :key="index">
          <td v-for="column in columns" :key="column.field">
            {{ row[column.field] }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="paginatedData.length === 0" class="section">
      <div class="content has-text-grey has-text-centered">
        <p>
          <SvgIcon :path="mdiEmoticonSad" :size="48" />
        </p>
        <p>Nothing here.</p>
      </div>
    </div>

    <nav
      v-if="totalPages > 1"
      class="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <a
        class="pagination-previous"
        :class="{ 'is-disabled': currentPage === 1 }"
        @click="currentPage > 1 ? currentPage-- : null"
      >
        Previous
      </a>
      <a
        class="pagination-next"
        :class="{ 'is-disabled': currentPage === totalPages }"
        @click="currentPage < totalPages ? currentPage++ : null"
      >
        Next
      </a>
      <ul class="pagination-list">
        <li v-for="page in displayedPages" :key="page">
          <a
            v-if="page !== '...'"
            class="pagination-link"
            :class="{ 'is-current': page === currentPage }"
            @click="typeof page === 'number' ? (currentPage = page) : null"
          >
            {{ page }}
          </a>
          <span v-else class="pagination-ellipsis">&hellip;</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { mdiChevronUp, mdiChevronDown, mdiEmoticonSad } from '@mdi/js'
import type { Company, TableColumn, SortDirection } from '@/types'

// Props
interface Props {
  data: Company[]
  columns: TableColumn[]
  perPage?: number
  defaultSort?: [string, SortDirection]
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 15,
  defaultSort: () => ['', 'asc'],
})

// State
const currentPage = ref(1)
const sortField = ref(props.defaultSort[0])
const sortDirection = ref<SortDirection>(props.defaultSort[1])

// Computed
const sortedData = computed<Company[]>(() => {
  if (!sortField.value) return props.data

  return [...props.data].sort((a: Company, b: Company) => {
    const aVal = a[sortField.value as keyof Company]
    const bVal = b[sortField.value as keyof Company]

    let comparison = 0
    if (aVal > bVal) comparison = 1
    if (aVal < bVal) comparison = -1

    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const paginatedData = computed<Company[]>(() => {
  const start = (currentPage.value - 1) * props.perPage
  const end = start + props.perPage
  return sortedData.value.slice(start, end)
})

const totalPages = computed<number>(() => {
  return Math.ceil(sortedData.value.length / props.perPage)
})

const displayedPages = computed<(number | string)[]>(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Methods
const toggleSort = (field: keyof Company): void => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Watchers
watch(
  () => props.data,
  () => {
    currentPage.value = 1
  },
)
</script>

<style scoped>
.data-table {
  margin-bottom: 1.5rem;
}

.pagination {
  margin-top: 1rem;
}
</style>
