<template>
  <div class="home">
    <Navbar />
    <template>
      <div class="main-container main-container-weatherfilter">
        <h1>天氣條件檢索</h1>
        <div>
          <div class="filterConditions-wrapper">
            <div class="form-row">
              <label>日期</label>
              <div class="select-wrapper">
                <select name="a-type" id="a-type" v-model="filterConditions.date" required>
                  <option v-bind:value="0" selected>{{
                  datasetOneWeek.locations.location[0].weatherElement[3].time[0].startTime.slice(0, 10) }}
                  </option>
                  <option v-bind:value="index" v-for="index in 6" v-bind:key="index">{{
                  datasetOneWeek.locations.location[0].weatherElement[3].time[index].startTime.slice(0, 10) }}
                  </option>
                </select>
              </div>
            </div>

            <label for="highestTemperature">最高溫</label>
            <input id="highestTemperature" type="number" min="-20" max="50"
              v-model="filterConditions.highestTemperature.value">

            <label for="lowestTemperature">最低溫</label>
            <input id="lowestTemperature" type="number" min="-20" max="50"
              v-model="filterConditions.lowestTemperature.value">

            <label for="rainrate">降雨機率</label>
            <input id="rainrate" type="number" min="0" max="100" v-model="filterConditions.rainrate.value">
          </div>
          <button type="button" v-on:click="filter">Filter</button>
        </div>

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
                    <div>
                      <img
                        v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + locat.weatherElement[12].time[index - 1].elementValue[1].value +'.svg'"
                        v-bind:title="locat.weatherElement[12].time[index - 1].elementValue[0].value"
                        v-bind:alt="locat.weatherElement[12].time[index - 1].elementValue[0].value">
                    </div>
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
import { Toast } from '../utils/helpers'

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      filterMountains: [],
      filterConditions: {
        date: 0,
        highestTemperature: {
          value: 30,
          index: 3
        },
        lowestTemperature: {
          value: 20,
          index: 4
        },
        rainrate: {
          value: 50,
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
      Toast.fire({
        icon: 'warning',
        title: '檢索中'
      })

      this.filterMountains = []
      let date = this.filterConditions.date
      // 最高溫 <= 最高溫篩選值 && 最低溫 >= 最低溫篩選值 && 降雨機率 <= 降雨機率篩選值
      this.datasetOneWeek.locations.location.forEach(locat => {
        if (Number(locat.weatherElement[3].time[date].elementValue.value) <= Number(this.filterConditions.highestTemperature.value) && Number(locat.weatherElement[4].time[date].elementValue.value) >= Number(this.filterConditions.lowestTemperature.value) && Number(locat.weatherElement[9].time[date].elementValue.value) <= Number(this.filterConditions.rainrate.value)) {
          // 加入該地點到清單中
          this.filterMountains.push(locat)
        }
      })

      if (this.filterMountains.length === 0) {
        Toast.fire({
          icon: 'error',
          title: '檢索完成，無匹配結果'
        })
      } else {
        Toast.fire({
          icon: 'success',
          title: '檢索完成'
        })
      }
    }
  },
}
</script>

<style>
.filterConditions-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 200px;
}

.filterConditions-wrapper input {
  margin-bottom: 10px;
}
</style>