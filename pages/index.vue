<template>
  <div>
    <section class="hero is-fullheight has-bg-img" id="top">
      <div class="hero-body background">
        <div class="container has-text-centered">
          <h1 class="title is-1 has-text-white">Where is Taipei?</h1>
          <h3 class="subtitle is-3 has-text-white">
            Taipei is the capital of Taiwan.
          </h3>
          <h6 class="subtitle is-6 has-text-white">
            Scroll down for a list of companies and their views on this topic...
          </h6>
          <a href="#table">
            <SvgIcon
              :path="mdiChevronDown"
              :size="48"
              class="scrollToButton has-text-white"
            />
          </a>
        </div>
      </div>
    </section>
    <section class="hero is-fullheight" id="table">
      <div class="hero-body items-top">
        <div class="container has-text-centered" style="width:100%">
          <div class="columns">
            <div class="column is-7">
              <div class="field">
                <p class="control has-icons-left">
                  <input
                    v-model="search"
                    class="input"
                    type="text"
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
                    <select v-model="selectedIndustry">
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
                    <select v-model="selectedStance">
                      <option :value="undefined">Filter by stance</option>
                      <option v-for="stance in stances" :value="stance" :key="stance">
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
              <button class="button is-primary is-fullwidth" @click="resetFields">
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
              <pie-chart :chart-data="pieChartData" />
            </div>
          </div>
        </div>
      </div>
      <a href="#top">
        <SvgIcon
          :path="mdiChevronUp"
          :size="48"
          :class="['scrollToTopButton', 'has-text-white', isScrolled ? 'show' : '']"
        />
      </a>

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
    </section>
  </div>
</template>

<script>
import { data as importData } from '@/data'
import PieChart from '@/components/pie.vue'
import DataTable from '@/components/DataTable.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { mdiChevronDown, mdiChevronUp, mdiMagnify, mdiFilter, mdiGithub } from '@mdi/js'
import uniqWith from 'lodash.uniqwith'
import isEqual from 'lodash.isequal'

const data = uniqWith(importData, isEqual)

export default {
  components: {
    PieChart,
    DataTable,
    SvgIcon
  },
  data() {
    return {
      search: '',
      selectedIndustry: undefined,
      selectedStance: undefined,
      data,
      columns: [
        {
          field: 'company_name',
          label: 'Company Name',
          sortable: true
        },
        {
          field: 'industry',
          label: 'Industry',
          sortable: true
        },
        {
          field: 'stance',
          label: 'Stance',
          sortable: true
        }
      ],
      isScrolled: false,
      mdiChevronDown,
      mdiChevronUp,
      mdiMagnify,
      mdiFilter,
      mdiGithub
    }
  },
  computed: {
    filteredData() {
      return this.data.filter(entry => {
        return (
          entry.company_name
            .toLowerCase()
            .includes(this.search.toLowerCase()) &&
          this.isSelectedIndustry(entry.industry) &&
          this.isSelectedStance(entry.stance)
        )
      })
    },
    industries() {
      return Array.from(new Set(this.data.map(entry => entry.industry)))
    },
    stances() {
      return Array.from(new Set(this.data.map(entry => entry.stance)))
    },
    stancesWithAmount() {
      return this.filteredData.reduce((stances, curr) => {
        if (stances[curr.stance]) {
          stances[curr.stance] += 1
        } else {
          stances[curr.stance] = 1
        }
        return stances
      }, {})
    },
    pieChartData() {
      const labels = Object.keys(this.stancesWithAmount)

      const colorMapping = {
        China: '#F7464A',
        Taiwan: '#018002',
        'Chinese Taipei': '#FDB45C',
        'Taiwan ROC': '#949FB1',
        'Taiwan Region': '#4D5360'
      }
      const datasets = [
        {
          data: Object.values(this.stancesWithAmount),
          backgroundColor: labels.map(label => colorMapping[label])
        }
      ]
      return {
        labels,
        datasets
      }
    }
  },
  methods: {
    resetFields() {
      this.selectedIndustry = undefined
      this.selectedStance = undefined
      this.search = ''
    },
    isSelectedIndustry(industry) {
      if (!this.selectedIndustry) {
        return true
      }
      return industry.toLowerCase() === this.selectedIndustry.toLowerCase()
    },
    isSelectedStance(stance) {
      if (!this.selectedStance) {
        return true
      }
      return stance.toLowerCase() === this.selectedStance.toLowerCase()
    },
    handleScroll() {
      if (window.scrollY > 500) {
        this.isScrolled = true
      } else {
        this.isScrolled = false
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
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
