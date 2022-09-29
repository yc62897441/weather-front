<template>
  <div class="home">
    <Navbar class="navbar" />
    <div class="main-container main-container-mountain">
      <div class="title-wrapper">
        <h1>{{ mountainOneWeek.locationName }}</h1>
      </div>

      <div>
        <div class="subtitle-wrapper">
          <h2>一周預報</h2>
        </div>
        <table class="main-table">
          <thead class="table-header">
            <tr class="table-row">
              <th class="table-cell table-cell-name"></th>
              <th class="table-cell mountain-table-cell-each-day" v-for="time in mountainOneWeek.weatherElement[3].time"
                v-bind:key="'date' + time.startTime">
                <div>{{ time.startTime.slice(0, 10) }}</div>
              </th>
            </tr>
          </thead>

          <tbody class="table-body mountain-table-body">
            <tr class="table-row" v-for="weatherElement in mountainOneWeek.weatherElement"
              v-bind:key="weatherElement.description">
              <td class="table-cell table-cell-name"> {{ weatherElement.description }} </td>
              <template v-if="weatherElement.description === '天氣現象'">
                <td class="table-cell mountain-table-cell-each-day" v-for="index in 7" v-bind:key="index">
                  <div class="mountain-table-cell-each-day_info_Wx">
                    <img
                      v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + weatherElement.time[index - 1].elementValue[1].value +'.svg'"
                      v-bind:title="weatherElement.time[index - 1].elementValue[0].value"
                      v-bind:alt="weatherElement.time[index - 1].elementValue[0].value">
                  </div>
                </td>
              </template>
              <template v-else>
                <td class="table-cell mountain-table-cell-each-day" v-for="index in 7" v-bind:key="index">
                  <div>
                    <div v-if="weatherElement.time[index - 1].elementValue.value">{{ weatherElement.time[index -
                    1].elementValue.value
                    }}</div>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <br>

      <div>
        <div class="subtitle-wrapper">
          <h2>每3小時預報</h2>
        </div>
        <table class="main-table">
          <thead class="table-header">
            <tr class="table-row">
              <th class="table-cell table-cell-name"></th>
              <th class="table-cell mountain-table-cell-each-day"
                v-for="time in mountainPerThreeHours.weatherElement[0].time" v-bind:key="'dataTime' + time">
                <div>{{ time.dataTime.slice(0, 10) }} {{ time.dataTime.slice(11, 16) }}</div>
              </th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr class="table-row" v-for="weatherElement in mountainPerThreeHours.weatherElement"
              v-bind:key="weatherElement.description">
              <td class="table-cell table-cell-name"> {{ weatherElement.description }} </td>
              <template v-if="weatherElement.description === '天氣現象'">
                <td class="table-cell mountain-table-cell-each-day" v-for="index in 24" v-bind:key="index">
                  <div class="mountain-table-cell-each-day_info_Wx" v-if="weatherElement.time[index - 1]">
                    <img
                      v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + weatherElement.time[index - 1].elementValue[1].value +'.svg'"
                      v-bind:title="weatherElement.time[index - 1].elementValue[0].value"
                      v-bind:alt="weatherElement.time[index - 1].elementValue[0].value">
                  </div>
                </td>
              </template>
              <template v-else>
                <template v-if="weatherElement.time.length === 24">
                  <td class="table-cell mountain-table-cell-each-day" v-for="index in 24" v-bind:key="index">
                    <div v-if="weatherElement.time[index - 1]">
                      {{ weatherElement.time[index - 1].elementValue.value }}
                    </div>
                  </td>
                </template>
                <template v-else-if="weatherElement.time.length === 12">
                  <td class="table-cell mountain-table-cell-each-day-colspan-2" v-for="index in 12" v-bind:key="index">
                    <div v-if="weatherElement.time[index - 1]">
                      {{ weatherElement.time[index - 1].elementValue.value }}
                    </div>
                  </td>
                </template>
                <template v-else-if="weatherElement.time.length === 6">
                  <td class="table-cell mountain-table-cell-each-day-colspan-4" v-for="index in 6" v-bind:key="index">
                    <div v-if="weatherElement.time[index - 1]">
                      {{ weatherElement.time[index - 1].elementValue.value }}
                    </div>
                  </td>
                </template>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <Footer class="footer" />
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
      mountainOneWeek: {},
      mountainPerThreeHours: {},
    }
  },
  computed: {
    ...mapState(['datasetOneWeek', 'datasetPerThreeHours'])
  },
  methods: {
    amendDatasetOneWeek() {
      // weatherElement 第 8, 9, 12, 13, 14 筆物件，其資訊結構需要再經整理成與其他筆物件格式一致
      const datasetOneWeekWeatherElementNeedToSetIndexs = [7, 8, 11, 13]
      datasetOneWeekWeatherElementNeedToSetIndexs.forEach(index => {
        if (index === 7 || index === 8) {
          this.mountainOneWeek.weatherElement[index] = {
            ...this.mountainOneWeek.weatherElement[index],
            time: this.mountainOneWeek.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue[1].measures,
                value: eachTime.elementValue[1].value
              },
              endTime: eachTime.endTime,
              startTime: eachTime.startTime
            }))
          }
        } else {
          this.mountainOneWeek.weatherElement[index] = {
            ...this.mountainOneWeek.weatherElement[index],
            time: this.mountainOneWeek.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: index,
                value: eachTime.elementValue[0].value + ' ' + eachTime.elementValue[0].measures + '；' + eachTime.elementValue[1].value + ' ' + eachTime.elementValue[1].measures
              },
              endTime: eachTime.endTime,
              startTime: eachTime.startTime
            }))
          }
        }
      })
    },
    amendDatasetPerThreeHours() {
      // weatherElement 第 7, 8, 10 筆物件，其資訊結構需要再經整理成與其他筆物件格式一致
      const datasetPerThreeHoursWeatherElementNeedToSetIndexs = [6, 7]
      datasetPerThreeHoursWeatherElementNeedToSetIndexs.forEach(index => {
        if (index === 6) {
          this.mountainPerThreeHours.weatherElement[index] = {
            ...this.mountainPerThreeHours.weatherElement[index],
            time: this.mountainPerThreeHours.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: index,
                value: eachTime.elementValue[0].value + ' ' + eachTime.elementValue[0].measures + '；' + eachTime.elementValue[1].value + ' ' + eachTime.elementValue[1].measures
              },
              dataTime: eachTime.dataTime
            }))
          }
        } else if (index === 7) {
          this.mountainPerThreeHours.weatherElement[index] = {
            ...this.mountainPerThreeHours.weatherElement[index],
            time: this.mountainPerThreeHours.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue[1].measures,
                value: eachTime.elementValue[1].value
              },
              dataTime: eachTime.dataTime
            }))
          }
        }
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (this.$route.name === 'mountain') {
      this.datasetOneWeek.locations.location.forEach(locat => {
        if (locat.parameterSet.parameter.parameterValue === to.params.id) {
          this.mountainOneWeek = {
            ...locat
          }
          this.amendDatasetOneWeek()
        }
      })

      this.datasetPerThreeHours.locations.location.forEach(locat => {
        if (locat.parameterSet.parameter.parameterValue === to.params.id) {
          this.mountainPerThreeHours = {
            ...locat
          }
          this.amendDatasetPerThreeHours()
        }
      })
    }
    next()
  },
  mounted() {
    this.datasetOneWeek.locations.location.forEach(locat => {
      if (locat.parameterSet.parameter.parameterValue === this.$route.params.id) {
        this.mountainOneWeek = {
          ...locat
        }
        this.amendDatasetOneWeek()
      }
    })

    this.datasetPerThreeHours.locations.location.forEach(locat => {
      if (locat.parameterSet.parameter.parameterValue === this.$route.params.id) {
        this.mountainPerThreeHours = {
          ...locat
        }
        this.amendDatasetPerThreeHours()
      }
    })
  },
}
</script>
<style>
.subtitle-wrapper {
  padding-bottom: 3px;
  font-size: 1rem;
  font-weight: 700;
}

.mountain-table-body {
  /* 加入 display: block，才可以用 height 或 max-height 搭配 overflow 去設定超出高度後的樣式*/
  display: block;
  max-height: none;
  overflow: visible;
}

.table-header .mountain-table-cell-each-day>div:nth-child(1) {
  font-size: 1.2rem;
  padding: 3px 0px;
}

.mountain-table-cell-each-day {
  width: 120px;
  padding: 5px 0px;
}

.mountain-table-cell-each-day-colspan-2 {
  width: 240px;
}

.mountain-table-cell-each-day-colspan-4 {
  width: 480px;
}

.mountain-table-cell-each-day_info_Wx img {
  width: 80px;
  height: 80px;
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 576px) {
  .subtitle-wrapper {
    padding-bottom: 5px;
    font-size: 1.2rem;
    font-weight: 700;
  }
}
</style>