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
                v-bind:key="'OneWeek date' + time.startTime">
                <div>{{ time.startTime.slice(0, 10) }}</div>
              </th>
            </tr>
          </thead>

          <tbody class="table-body mountain-table-body">
            <tr class="table-row" v-for="weatherElement in mountainOneWeek.weatherElement"
              v-bind:key="'OneWeek date' + weatherElement.description">
              <td class="table-cell table-cell-name"> {{ weatherElement.description }} </td>
              <template v-if="weatherElement.description === '天氣現象'">
                <td class="table-cell mountain-table-cell-each-day" v-for="index in 7" v-bind:key="'OneWeek date' + index">
                  <div class="mountain-table-cell-each-day_info_Wx">
                    <img
                      v-bind:src="'https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/' + weatherElement.time[index - 1].elementValue[1].value +'.svg'"
                      v-bind:title="weatherElement.time[index - 1].elementValue[0].value"
                      v-bind:alt="weatherElement.time[index - 1].elementValue[0].value">
                  </div>
                </td>
              </template>
              <template v-else>
                <td class="table-cell mountain-table-cell-each-day" v-for="index in 7" v-bind:key="'OneWeek date' + index">
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
                v-for="time in mountainPerThreeHours.weatherElement[0].time" v-bind:key="'ThreeHours dataTime' + time.dataTime">
                <div>{{ time.dataTime.slice(0, 10) }} {{ time.dataTime.slice(11, 16) }}</div>
              </th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr class="table-row" v-for="weatherElement in mountainPerThreeHours.weatherElement"
              v-bind:key="'ThreeHours' + weatherElement.description">
              <td class="table-cell table-cell-name"> {{ weatherElement.description }} </td>
              <template v-if="weatherElement.description === '天氣現象'">
                <td class="table-cell mountain-table-cell-each-day" v-for="index in 24" v-bind:key="'ThreeHours' + index">
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
                  <td class="table-cell mountain-table-cell-each-day" v-for="index in 24" v-bind:key="'ThreeHours' + index">
                    <div v-if="weatherElement.time[index - 1]">
                      {{ weatherElement.time[index - 1].elementValue.value }}
                    </div>
                  </td>
                </template>
                <template v-else-if="weatherElement.time.length === 11 || weatherElement.time.length === 12">
                  <td class="table-cell mountain-table-cell-each-day-colspan-2" v-for="index in 12" v-bind:key="'ThreeHours' + index">
                    <div v-if="weatherElement.time[index - 1]">
                      {{ weatherElement.time[index - 1].elementValue.value }}
                    </div>
                  </td>
                </template>
                <template v-else-if="weatherElement.time.length === 6 || weatherElement.time.length === 5">
                  <td class="table-cell mountain-table-cell-each-day-colspan-4" v-for="index in 6" v-bind:key="'ThreeHours' + index">
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
import indexAPI from '../api/index'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      dataCategory: {
        oneWeek: 'F-B0053-031', //登山一週24小時天氣預報
        oneWeekDayNight: 'F-B0053-033', //登山一週日夜天氣預報 33
        perThreeHours: 'F-B0053-035' //登山三天3小時天氣預報
      },
      dataType: 'JSON',
      datasetOneWeek: {
        locations: {
          location: []
        }
      },
      datasetPerThreeHours: {
        locations: {
          location: []
        }
      },
      isLoading: true,
      mountainOneWeek: {},
      mountainPerThreeHours: {},
    }
  },
  methods: {
    async fetchDatasetOneWeek() {
      try {
        this.isLoading = true
        const dataCategory = this.dataCategory.oneWeek
        const dataType = this.dataType
        const response = await indexAPI.getWeatherData({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }

        // 所有的 locations
        this.datasetOneWeek = {
          ...response.data.dataset
        }

        // 找出本頁特定的 location
        this.datasetOneWeek.locations.location.forEach(locat => {
          if (locat.parameterSet.parameter.parameterValue === this.$route.params.id) {
            this.mountainOneWeek = {
              ...locat
            }
            this.amendDatasetOneWeek()
          }
        })

        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)
      }
    },
    async fetchDatasetPerThreeHours() {
      try {
        this.isLoading = true
        const dataCategory = this.dataCategory.perThreeHours
        const dataType = this.dataType
        const response = await indexAPI.getWeatherData({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }

        // 所有的 locations
        this.datasetPerThreeHours = {
          ...response.data.dataset
        }

        // 找出本頁特定的 location
        this.datasetPerThreeHours.locations.location.forEach(locat => {
          if (locat.parameterSet.parameter.parameterValue === this.$route.params.id) {
            this.mountainPerThreeHours = {
              ...locat
            }
            this.amendDatasetPerThreeHours()
          }
        })

        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)
      }
    },
    amendDatasetOneWeek() {
      // weatherElement 第 0, 1, 3, 4, 5, 6 筆物件為溫度相關，加上 '°C'
      // weatherElement 第 2, 9 筆物件與 % 相關，加上 '%'
      // weatherElement 第 7, 8, 11, 13 筆物件，其資訊結構需要再經整理成與其他筆物件格式一致
      const datasetOneWeekWeatherElementNeedToSetIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13]
      datasetOneWeekWeatherElementNeedToSetIndexs.forEach(index => {
        if (index === 0 || index === 1 || index === 3 || index === 4 || index === 5 || index === 6) {
          this.mountainOneWeek.weatherElement[index] = {
            ...this.mountainOneWeek.weatherElement[index],
            time: this.mountainOneWeek.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue.measures,
                value: eachTime.elementValue.value + '°C'
              },
              endTime: eachTime.endTime,
              startTime: eachTime.startTime
            }))
          }
        } else if (index === 2 || index === 9) {
          this.mountainOneWeek.weatherElement[index] = {
            ...this.mountainOneWeek.weatherElement[index],
            time: this.mountainOneWeek.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue.measures,
                value: eachTime.elementValue.value ? eachTime.elementValue.value + '%' : ''
              },
              endTime: eachTime.endTime,
              startTime: eachTime.startTime
            }))
          }
        } else if (index === 7 || index === 8) {
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
      // weatherElement 第 0, 1, 8 筆物件為溫度相關，加上 '°C'
      // weatherElement 第 2, 3, 4 筆物件與 % 相關，加上 '%'
      // weatherElement 第 6, 7 筆物件，其資訊結構需要再經整理成與其他筆物件格式一致
      const datasetPerThreeHoursWeatherElementNeedToSetIndexs = [0, 1, 2, 3, 4, 6, 7, 8]
      datasetPerThreeHoursWeatherElementNeedToSetIndexs.forEach(index => {
        if (index === 0 || index === 1 || index === 8) {
          this.mountainPerThreeHours.weatherElement[index] = {
            ...this.mountainPerThreeHours.weatherElement[index],
            time: this.mountainPerThreeHours.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue.measures,
                value: eachTime.elementValue.value + '°C'
              },
              dataTime: eachTime.dataTime
            }))
          }
        } else if (index === 2 || index === 3 || index === 4) {
          this.mountainPerThreeHours.weatherElement[index] = {
            ...this.mountainPerThreeHours.weatherElement[index],
            time: this.mountainPerThreeHours.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue.measures,
                value: eachTime.elementValue.value + '%'
              },
              dataTime: eachTime.dataTime
            }))
          }
        } else if (index === 6) {
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
    this.fetchDatasetOneWeek()
    this.fetchDatasetPerThreeHours()
  },
}
</script>
<style>
.subtitle-wrapper {
  padding-bottom: 3px;
  font-size: 1rem;
  font-weight: 700;
}

.table-header .mountain-table-cell-each-day>div:nth-child(1) {
  font-size: 1.2rem;
  padding: 3px 0px;
}

.mountain-table-body {
  /* 加入 display: block，才可以用 height 或 max-height 搭配 overflow 去設定超出高度後的樣式*/
  display: block;
  max-height: none;
  overflow: visible;
}

.mountain-table-body .table-row:nth-child(4) {
  color:var(--table-font-hot);
}

.mountain-table-body .table-row:nth-child(5) {
  color: var(--table-font-cold);
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
  width: 40px;
  height: 40px;
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 576px) {
  .subtitle-wrapper {
    padding-bottom: 5px;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .mountain-table-cell-each-day_info_Wx img {
    width: 50px;
    height: 50px;
  }
}
</style>