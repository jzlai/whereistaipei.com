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

    <nav v-if="totalPages > 1" class="pagination is-centered" role="navigation" aria-label="pagination">
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
            @click="currentPage = page"
          >
            {{ page }}
          </a>
          <span v-else class="pagination-ellipsis">&hellip;</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import SvgIcon from './SvgIcon.vue'
import { mdiChevronUp, mdiChevronDown, mdiEmoticonSad } from '@mdi/js'
import type { Company, TableColumn, SortDirection } from '@/types'
import type { PropType } from 'vue'

export default {
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Array as PropType<Company[]>,
      required: true
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true
    },
    perPage: {
      type: Number,
      default: 15
    },
    defaultSort: {
      type: Array as PropType<[string, SortDirection]>,
      default: () => ['', 'asc']
    }
  },
  data() {
    return {
      currentPage: 1 as number,
      sortField: this.defaultSort[0] as string,
      sortDirection: this.defaultSort[1] as SortDirection,
      mdiChevronUp,
      mdiChevronDown,
      mdiEmoticonSad
    }
  },
  computed: {
    sortedData(): Company[] {
      if (!this.sortField) return this.data

      return [...this.data].sort((a: Company, b: Company) => {
        const aVal = a[this.sortField as keyof Company]
        const bVal = b[this.sortField as keyof Company]

        let comparison = 0
        if (aVal > bVal) comparison = 1
        if (aVal < bVal) comparison = -1

        return this.sortDirection === 'asc' ? comparison : -comparison
      })
    },
    paginatedData(): Company[] {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.sortedData.slice(start, end)
    },
    totalPages(): number {
      return Math.ceil(this.sortedData.length / this.perPage)
    },
    displayedPages(): (number | string)[] {
      const pages: (number | string)[] = []
      const total = this.totalPages
      const current = this.currentPage

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
    }
  },
  watch: {
    data() {
      this.currentPage = 1
    }
  },
  methods: {
    toggleSort(field: keyof Company): void {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    }
  }
}
</script>

<style scoped>
.data-table {
  margin-bottom: 1.5rem;
}

.pagination {
  margin-top: 1rem;
}
</style>
