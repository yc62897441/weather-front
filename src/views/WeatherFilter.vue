<template>
  <div class="home">
    <Navbar />
    <template>
      <div class="main-container main-container-weatherfilter">
        <h1>天氣條件檢索</h1>

        <label for="rainrate">降雨機率</label>
        <input id="rainrate" type="number" min="0" max="100" v-model="filterConditions.rainrate.value">

        <button type="button" v-on:click="filter">Filter</button>

        <template v-if="filterMountains.length > 0">
          <table class="main-table">
            <thead class="table-header">
              <tr class="table-row">
                <th class="table-cell table-cell-name"></th>
                <th class="table-cell table-cell-each-day" v-for="time in filterMountains[0].weatherElement[3].time"
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
              <tr class="table-row" v-for="locat in filterMountains"
                v-bind:key="locat.parameterSet.parameter.parameterValue">
                <td class="table-cell table-cell-name">
                  <router-link class="link" v-bind:to="'/mountain/' + locat.parameterSet.parameter.parameterValue">
                    {{ locat.locationName }}
                  </router-link>
                </td>
                <td class="table-cell table-cell-each-day" v-for="index in 7" v-bind:key="index">
                  <div>
                    <div>{{ locat.weatherElement[3].time[index - 1].elementValue.value }}°C</div>
                    <div>{{ locat.weatherElement[4].time[index - 1].elementValue.value }}°C</div>
                    <div>{{ locat.weatherElement[9].time[index - 1].elementValue.value || 'NA' }}%</div>
                    <div>{{ locat.weatherElement[12].time[index - 1].elementValue[0].value }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

      </div>
    </template>
    <Footer />
  </div>
</template>

<script>
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
      filterMountains: [],
      filterConditions: {
        rainrate: {
          value: '',
          index: 9
        }
      }
    }
  },
  computed: {
    ...mapState(['datasetOneWeek', 'datasetPerThreeHours'])
  },
  methods: {
    filter() {
      this.filterMountains = []
      this.datasetOneWeek.locations.location.forEach(locat => {
        if (Number(locat.weatherElement[9].time[0].elementValue.value) < Number(this.filterConditions.rainrate.value)) {
          this.filterMountains.push(locat)
        }
      })
    }
  },
}
</script>
