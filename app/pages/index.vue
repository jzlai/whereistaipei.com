<template>
  <div>
    <a class="skip-link" href="#company-data">Skip to company data</a>
    <section
      ref="topSection"
      class="hero is-fullheight has-bg-img"
      aria-labelledby="page-title"
    >
      <div class="hero-body background">
        <div class="container has-text-centered">
          <h1 id="page-title" class="title is-1 has-text-white">
            Where is Taipei?
          </h1>
          <h2 class="subtitle is-3 has-text-white">
            Taipei is the capital of Taiwan.
          </h2>
          <p class="subtitle is-6 has-text-white">
            Scroll down for a list of companies and their views on this topic...
          </p>
          <button
            class="scroll-button"
            aria-label="Scroll to company data"
            @click="scrollToTable"
          >
            <SvgIcon
              :path="mdiChevronDown"
              :size="48"
              class="scrollToButton has-text-white"
            />
          </button>
        </div>
      </div>
    </section>
    <main
      id="company-data"
      ref="tableSection"
      class="hero is-fullheight"
      tabindex="-1"
    >
      <div class="hero-body items-top">
        <div class="container has-text-centered" style="width: 100%">
          <div class="columns">
            <div class="column is-7">
              <div class="field">
                <p class="control has-icons-left">
                  <label class="label has-text-left" for="company-search"
                    >Search companies</label
                  >
                  <input
                    id="company-search"
                    v-model="search"
                    class="input"
                    type="search"
                    placeholder="Search"
                  />
                  <span class="icon is-left">
                    <SvgIcon :path="mdiMagnify" />
                  </span>
                </p>
              </div>
            </div>
            <div class="column is-2">
              <div class="field">
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <label class="sr-only" for="industry-filter"
                      >Filter by industry</label
                    >
                    <select id="industry-filter" v-model="selectedIndustry">
                      <option :value="undefined">Filter by industry</option>
                      <option
                        v-for="industry in industries"
                        :value="industry"
                        :key="industry"
                      >
                        {{ industry }}
                      </option>
                    </select>
                  </div>
                  <span class="icon is-left">
                    <SvgIcon :path="mdiFilter" />
                  </span>
                </div>
              </div>
            </div>
            <div class="column is-2">
              <div class="field">
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <label class="sr-only" for="stance-filter"
                      >Filter by stance</label
                    >
                    <select id="stance-filter" v-model="selectedStance">
                      <option :value="undefined">Filter by stance</option>
                      <option
                        v-for="stance in stances"
                        :value="stance"
                        :key="stance"
                      >
                        {{ stance }}
                      </option>
                    </select>
                  </div>
                  <span class="icon is-left">
                    <SvgIcon :path="mdiFilter" />
                  </span>
                </div>
              </div>
            </div>
            <div class="column is-1">
              <button
                class="button is-primary is-fullwidth"
                @click="resetFields"
              >
                Reset
              </button>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <DataTable
                :data="filteredData"
                :columns="columns"
                :default-sort="['company_name', 'asc']"
                :per-page="15"
              />
            </div>
            <div class="column is-4">
              <ClientOnly>
                <pie-chart :chart-data="pieChartData" />
                <template #fallback>
                  <p class="has-text-grey">Loading chart…</p>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="scrollToTop"
        class="scroll-button"
        aria-label="Scroll to top"
      >
        <SvgIcon
          :path="mdiChevronUp"
          :size="48"
          :class="[
            'scrollToTopButton',
            'has-text-white',
            isScrolled ? 'show' : '',
          ]"
        />
      </button>

      <footer class="footer">
        <div class="content has-text-centered">
          <p>
            <strong>whereistaipei.com</strong> by
            <a
              href="https://junzhe.me"
              target="_blank"
              rel="noopener noreferrer"
              >jzlai</a
            >
            <br />Contribute on
            <a
              href="https://github.com/jzlai/whereistaipei.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon :path="mdiGithub" :size="20" />
            </a>
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { data } from '@/data'
import PieChart from '@/components/pie.vue'
import DataTable from '@/components/DataTable.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiMagnify,
  mdiFilter,
  mdiGithub,
} from '@mdi/js'
import { STANCE_COLORS } from '@/constants/stances'
import type {
  Company,
  TableColumn,
  ChartData,
  Stance,
  PartialStanceCounts,
} from '@/types'

// Refs
const topSection = ref<HTMLElement>()
const tableSection = ref<HTMLElement>()
const search = ref('')
const selectedIndustry = ref<string>()
const selectedStance = ref<Stance>()
const isScrolled = ref(false)

// Constants
const columns: TableColumn[] = [
  {
    field: 'company_name',
    label: 'Company Name',
    sortable: true,
  },
  {
    field: 'industry',
    label: 'Industry',
    sortable: true,
  },
  {
    field: 'stance',
    label: 'Stance',
    sortable: true,
  },
]

// Computed
const filteredData = computed<Company[]>(() => {
  return data.filter(entry => {
    return (
      entry.company_name.toLowerCase().includes(search.value.toLowerCase()) &&
      isSelectedIndustry(entry.industry) &&
      isSelectedStance(entry.stance)
    )
  })
})

const industries = computed<string[]>(() => {
  return Array.from(new Set(data.map(entry => entry.industry)))
})

const stances = computed<Stance[]>(() => {
  return Array.from(new Set(data.map(entry => entry.stance)))
})

const stancesWithAmount = computed<PartialStanceCounts>(() => {
  return filteredData.value.reduce((acc, curr) => {
    acc[curr.stance] = (acc[curr.stance] ?? 0) + 1
    return acc
  }, {} as PartialStanceCounts)
})

const pieChartData = computed<ChartData>(() => {
  const labels = Object.keys(stancesWithAmount.value) as Stance[]
  const datasets = [
    {
      data: Object.values(stancesWithAmount.value) as number[],
      backgroundColor: labels.map(label => STANCE_COLORS[label]),
    },
  ]
  return {
    labels,
    datasets,
  }
})

// Methods
const resetFields = (): void => {
  selectedIndustry.value = undefined
  selectedStance.value = undefined
  search.value = ''
}

const isSelectedIndustry = (industry: string): boolean => {
  if (!selectedIndustry.value) {
    return true
  }
  return industry.toLowerCase() === selectedIndustry.value.toLowerCase()
}

const isSelectedStance = (stance: Stance): boolean => {
  if (!selectedStance.value) {
    return true
  }
  return stance.toLowerCase() === selectedStance.value.toLowerCase()
}

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 500
}

const scrollToTop = (): void => {
  topSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const scrollToTable = (): void => {
  tableSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.has-bg-img {
  background: url('https://res.cloudinary.com/dtkhgxv0t/image/upload/v1589464359/taipei_gu3vyr.webp');
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
}

.background {
  background-color: rgba(0, 0, 0, 0.85);
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 2000;
  padding: 0.75rem 1rem;
  background: #fff;
  color: #015a01;
}

.skip-link:focus {
  top: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.scroll-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
}

.scrollToButton {
  animation: up-down 1s infinite alternate;
  -webkit-animation: up-down 1s infinite alternate;
}

.scrollToTopButton {
  display: flex;
  position: fixed;
  bottom: 2.5em;
  right: 2.5em;
  z-index: 1000;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.85);
  visibility: hidden;
  padding: 0.5rem;
}
.show {
  visibility: visible;
}

.items-top {
  align-items: normal !important;
}

@keyframes up-down {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}
@-webkit-keyframes up-down {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}
</style>
