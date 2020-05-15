<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  props: ['options'],
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
