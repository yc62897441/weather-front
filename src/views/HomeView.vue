<template>
  <div class="home">
    <Navbar />
    <Spinner v-if="isLoading" />
    <WeatherOverview v-else v-bind:propDatasetOneWeek="datasetOneWeek" />
    <Footer />
  </div>
</template>

<script>
import indexAPI from '../api/index'

import Navbar from '../components/Navbar.vue'
import WeatherOverview from '../components/WeatherOverview.vue'
import Footer from '../components/Footer.vue'
import Spinner from '../components/Spinner'

export default {
  components: {
    Navbar,
    WeatherOverview,
    Footer,
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
  }
}
</script>
