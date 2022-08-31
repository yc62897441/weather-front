<template>
  <div class="home">
    <Navbar />
    <div class="main-container main-container-mountain">
      <h1>{{ mountain.locationName }}</h1>

      <!-- <table class="main-table">
        <thead class="table-header">
          <tr class="table-row">
            <th class="table-cell table-cell-name">名字</th>
            <th class="table-cell table-cell-each-day"
              v-for="time in propDatasetOneWeek.locations.location[0].weatherElement[3].time"
              v-bind:key="'date' + time.startTime">
              <div>{{ time.startTime.slice(0, 10) }}</div>
              <div>
                <div>最高溫</div>
                <div>最低溫</div>
                <div>降雨機率</div>
                <div>天氣現象</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr class="table-row" v-for="locat in propDatasetOneWeek.locations.location"
            v-bind:key="locat.parameterSet.parameter.parameterValue">
            <td class="table-cell table-cell-name">{{ locat.locationName }}</td>
            <td class="table-cell table-cell-each-day" v-for="index in 7" v-bind:key="index">
              <div>
                <div>{{ locat.weatherElement[3].time[index - 1].elementValue.value }}°C</div>
                <div>{{ locat.weatherElement[4].time[index - 1].elementValue.value }}°C</div>
                <div>{{ locat.weatherElement[9].time[index - 1].elementValue.value }}%</div>
                <div>{{ locat.weatherElement[12].time[index - 1].elementValue[0].value }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table> -->

    </div>
    <Footer />
  </div>
</template>

<script>
import indexAPI from '../api/index'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      mountain: {

      }
    }
  },
  computed: {
    ...mapState(['datasetOneWeek'])
  },
  methods: {

  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate', to.params.id)
    if (this.$route.name === 'mountain') {
      this.datasetOneWeek.locations.location.forEach(locat => {
        if (locat.parameterSet.parameter.parameterValue === to.params.id) {
          this.mountain = {
            ...locat
          }
        }
      })
    }
    next()
  },
  mounted() {
    console.log('mounted', this.$route.params.id)
    this.datasetOneWeek.locations.location.forEach(locat => {
      if (locat.parameterSet.parameter.parameterValue === this.$route.params.id) {
        this.mountain = {
          ...locat
        }
      }
    })
  },
}
</script>
