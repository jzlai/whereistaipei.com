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
          <a href="#" v-scroll-to="'#table'">
            <b-icon
              icon="chevron-down"
              size="is-large"
              type="is-white"
              class="scrollToButton"
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
              <b-input
                v-model="search"
                placeholder="Search"
                icon="magnify"
                clearable
                style="margin-bottom: 15px"
              />
            </div>
            <div class="column is-2">
              <b-select
                v-model="selectedIndustry"
                placeholder="Filter by industry"
                icon="filter"
                expanded
              >
                <option
                  v-for="industry in industries"
                  :value="industry"
                  :key="industry"
                >
                  {{ industry }}
                </option>
              </b-select>
            </div>
            <div class="column is-2">
              <b-select
                v-model="selectedStance"
                placeholder="Filter by stance"
                icon="filter"
                expanded
              >
                <option v-for="stance in stances" :value="stance" :key="stance">
                  {{ stance }}
                </option>
              </b-select>
            </div>
            <div class="column is-1">
              <b-button class="is-primary" @click="resetFields">Reset</b-button>
            </div>
          </div>
          <div class="columns is-vcentered">
            <div class="column">
              <b-table
                :data="filteredData"
                :columns="columns"
                :default-sort="['company_name', 'asc']"
                :paginated="true"
                :striped="true"
                :per-page="16"
                sort-icon="chevron-down"
              >
                <template slot="empty">
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <p>
                        <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                      </p>
                      <p>Nothing here.</p>
                    </div>
                  </section>
                </template>
              </b-table>
            </div>
            <div class="column is-4">
              <pie-chart :chart-data="pieChartData" />
            </div>
          </div>
        </div>
      </div>

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
              <b-icon icon="github" />
            </a>
          </p>
        </div>
      </footer>
    </section>
  </div>
</template>

<script>
import { data } from '@/data'
import VueScrollTo from 'vue-scrollto'
import PieChart from '@/components/pie'

export default {
  components: {
    PieChart
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
      ]
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
    }
  }
}
</script>

<style scoped>
.has-bg-img {
  background: url('https://ik.imagekit.io/it4vm4fvks/taipei_-RYUI-8X8.jpeg');
  background-position: center center;
  background-attachment: fixed;
}

.background {
  background-color: rgba(0, 0, 0, 0.85);
}

.items-top {
  align-items: normal !important;
}

.scrollToButton {
  transition: all 0.2s ease-in-out;
}
.scrollToButton:hover {
  transform: scale(1.3);
}
.chart-container {
  max-width: 500px;
}
</style>
