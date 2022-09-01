<template>
  <div class="home">
    <Navbar />
    <div class="main-container main-container-mountain">
      <h1>{{ mountainOneWeek.locationName }}</h1>

      <div>
        <h2>一周預報</h2>
        <table class="main-table">
          <thead class="table-header">
            <tr class="table-row">
              <th class="table-cell table-cell-name">類型</th>
              <th class="table-cell table-cell-each-day" v-for="time in mountainOneWeek.weatherElement[3].time"
                v-bind:key="'date' + time.startTime">
                <div>{{ time.startTime.slice(0, 10) }}</div>
              </th>
            </tr>
          </thead>

          <tbody class="table-body">
            <tr class="table-row" v-for="weatherElement in mountainOneWeek.weatherElement"
              v-bind:key="weatherElement.description">
              <td class="table-cell table-cell-name"> {{ weatherElement.description }} </td>

              <td class="table-cell table-cell-each-day" v-for="index in 7" v-bind:key="index">
                <div>
                  <div v-if="weatherElement.time[index - 1].elementValue.value">{{ weatherElement.time[index -
                      1].elementValue.value
                  }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>每3小時預報</h2>
        <table class="main-table">
          <thead class="table-header">
            <tr class="table-row">
              <th class="table-cell table-cell-name">類型</th>
              <th class="table-cell table-cell-each-day" v-for="time in mountainPerThreeHours.weatherElement[0].time"
                v-bind:key="'dataTime' + time">
                <div>{{ time.dataTime.slice(0, 10) }} {{ time.dataTime.slice(11, 16) }}</div>
              </th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr class="table-row" v-for="weatherElement in mountainPerThreeHours.weatherElement"
              v-bind:key="weatherElement.description">
              <td class="table-cell table-cell-name"> {{ weatherElement.description }} </td>
              <td class="table-cell table-cell-each-day" v-for="index in 24" v-bind:key="index">
                <div v-if="weatherElement.time[index - 1]">
                  {{ weatherElement.time[index - 1].elementValue.value }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
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
      const datasetOneWeekWeatherElementNeedToSetIndexs = [7, 8, 11, 12, 13]
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
        } else if (index === 12) {
          this.mountainOneWeek.weatherElement[index] = {
            ...this.mountainOneWeek.weatherElement[index],
            time: this.mountainOneWeek.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue[0].measures,
                value: eachTime.elementValue[0].value
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
      const datasetPerThreeHoursWeatherElementNeedToSetIndexs = [6, 7, 9]
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
        } else if (index === 9) {
          this.mountainPerThreeHours.weatherElement[index] = {
            ...this.mountainPerThreeHours.weatherElement[index],
            time: this.mountainPerThreeHours.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue[0].measures,
                value: eachTime.elementValue[0].value
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
