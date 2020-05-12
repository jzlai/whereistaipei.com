<template>
  <div>
    <section class="hero is-fullheight has-bg-img" id="top">
      <div class="hero-body background">
        <div class="container has-text-centered">
          <h1 class="title is-1 has-text-white">
            Where is Taipei?
          </h1>
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
        <div class="container has-text-centered">
          <b-input
            v-model="search"
            placeholder="Search"
            icon="magnify"
            clearable
            style="margin-bottom: 15px"
          >
          </b-input>
          <b-table
            :data="filteredData"
            :columns="columns"
            :default-sort="['company_name', 'asc']"
            :paginated="true"
            :striped="true"
            :per-page="17"
          >
            <template slot="empty">
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <p>
                    <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                  </p>
                  <p>Nothing here.</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </div>
      <footer class="footer">
        <div class="content has-text-centered">
          <p>
            <strong>whereistaipei.com</strong> by
            <a href="https://junzhe.me">Jun-Zhe Lai</a> <br />
            Contribute on
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
import { data } from '@/data';
import VueScrollTo from 'vue-scrollto';

export default {
  data() {
    return {
      search: '',
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
    };
  },
  computed: {
    filteredData() {
      return this.data.filter(entry => {
        return entry.company_name
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    }
  }
};
</script>

<style scoped>
.has-bg-img {
  background: url('../assets/taipei.jpeg');
  background-position: center center;
  background-attachment: fixed;
}

.background {
  padding: 0;
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
</style>
