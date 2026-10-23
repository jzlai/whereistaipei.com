<template>
  <div class="data-table">
    <table class="table is-fullwidth is-striped is-hoverable">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            scope="col"
            :aria-sort="
              column.sortable && sortField === column.field
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined
            "
          >
            <button
              v-if="column.sortable"
              class="sort-button"
              type="button"
              @click="toggleSort(column.field)"
            >
              {{ column.label }}
              <span v-if="sortField === column.field" aria-hidden="true">
                <SvgIcon
                  :path="
                    sortDirection === 'asc' ? mdiChevronUp : mdiChevronDown
                  "
                  :size="16"
                />
              </span>
              <span class="sr-only">
                Sort {{ sortDirection === 'asc' ? 'descending' : 'ascending' }}
              </span>
            </button>
            <template v-else>{{ column.label }}</template>
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
      <button
        class="pagination-previous"
        :class="{ 'is-disabled': currentPage === 1 }"
        type="button"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </button>
      <button
        class="pagination-next"
        :class="{ 'is-disabled': currentPage === totalPages }"
        type="button"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
      <ul class="pagination-list">
        <li v-for="page in displayedPages" :key="page">
          <button
            v-if="page !== '...'"
            class="pagination-link"
            :class="{ 'is-current': page === currentPage }"
            type="button"
            :aria-current="page === currentPage ? 'page' : undefined"
            @click="typeof page === 'number' ? (currentPage = page) : null"
          >
            {{ page }}
          </button>
          <span v-else class="pagination-ellipsis">&hellip;</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import { ref, computed, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { mdiChevronUp, mdiChevronDown, mdiEmoticonSad } from '@mdi/js'
import type { TableColumn, SortDirection } from '@/types'

// Props
interface Props {
  data: T[]
  columns: TableColumn<T>[]
  perPage?: number
  defaultSort?: [keyof T & string, SortDirection]
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 15,
  defaultSort: undefined,
})

// State
const currentPage = ref(1)
const sortField = ref<keyof T & string>()
const sortDirection = ref<SortDirection>('asc')

if (props.defaultSort) {
  ;[sortField.value, sortDirection.value] = props.defaultSort
}

// Computed
const sortedData = computed<T[]>(() => {
  const field = sortField.value
  if (!field) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]

    const comparison =
      typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal))

    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const paginatedData = computed<T[]>(() => {
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
const toggleSort = (field: keyof T & string): void => {
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
.sort-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.data-table {
  margin-bottom: 1.5rem;
}

.pagination {
  margin-top: 1rem;
}
</style>
