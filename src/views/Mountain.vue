<template>
  <div class="home">
    <Navbar />
    <div class="main-container main-container-mountain">
      <h1>{{ mountain.locationName }}</h1>

      <div>
        <h2>一周預報</h2>
        <table class="main-table">
          <thead class="table-header">
            <tr class="table-row">
              <th class="table-cell table-cell-name">類型</th>
              <th class="table-cell table-cell-each-day" v-for="time in mountain.weatherElement[3].time"
                v-bind:key="'date' + time.startTime">
                <div>{{ time.startTime.slice(0, 10) }}</div>
              </th>
            </tr>
          </thead>

          <tbody class="table-body">
            <tr class="table-row" v-for="weatherElement in mountain.weatherElement"
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
    amendDatasetOneWeek() {
      // weatherElement 第 7, 8, 11, 12, 13 筆物件，其資訊結構需要再經整理成與其他筆物件格式一致
      const datasetOneWeekWeatherElementNeedToSetIndexs = [7, 8, 11, 12, 13]
      datasetOneWeekWeatherElementNeedToSetIndexs.forEach(index => {
        if (index === 7 || index === 8) {
          this.mountain.weatherElement[index] = {
            ...this.mountain.weatherElement[index],
            time: this.mountain.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue[1].measures,
                value: eachTime.elementValue[1].value
              },
              endTime: eachTime.endTime,
              startTime: eachTime.startTime
            }))
          }
        } else if (index === 12) {
          this.mountain.weatherElement[index] = {
            ...this.mountain.weatherElement[index],
            time: this.mountain.weatherElement[index].time.map(eachTime => ({
              elementValue: {
                measures: eachTime.elementValue[0].measures,
                value: eachTime.elementValue[0].value
              },
              endTime: eachTime.endTime,
              startTime: eachTime.startTime
            }))
          }
        } else {
          this.mountain.weatherElement[index] = {
            ...this.mountain.weatherElement[index],
            time: this.mountain.weatherElement[index].time.map(eachTime => ({
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
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate', to.params.id)
    if (this.$route.name === 'mountain') {
      this.datasetOneWeek.locations.location.forEach(locat => {
        if (locat.parameterSet.parameter.parameterValue === to.params.id) {
          this.mountain = {
            ...locat
          }
          this.amendDatasetOneWeek()
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
        this.amendDatasetOneWeek()
      }
    })
  },
}
</script>
