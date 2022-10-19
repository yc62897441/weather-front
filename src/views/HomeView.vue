<template>
  <div class="home">
    <Spinner v-if="isLoading" />
    <WeatherOverview class="WeatherOverview" v-else v-bind:propDatasetOneWeek="datasetOneWeek" />
  </div>
</template>

<script>
import indexAPI from '../api/index'

import WeatherOverview from '../components/WeatherOverview.vue'
import Spinner from '../components/Spinner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    WeatherOverview,
    Spinner
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
      isLoading: true
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
        this.datasetOneWeek = {
          ...response.data.dataset
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)
      }
    },
  },
  mounted() {
    this.fetchDatasetOneWeek()

    // Line Login 後顯示通知，是否成功向 Line platform 取得 line user 資料並存到後端資料庫中 
    if (this.$route.query.success_message) {
      Toast.fire({
        icon: 'success',
        title: `${this.$route.query.success_message}`
      })
    }
    if (this.$route.query.error_message) {
      Toast.fire({
        icon: 'error',
        title: `${this.$route.query.error_message}`
      })
    }
  }
}
</script>

<style>
</style>
