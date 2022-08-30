<template>
  <div class="home">
    <Navbar />
    <WeatherOverview v-bind:propDataset="dataset" />
    <Footer />
  </div>
</template>

<script>
import indexAPI from '../api/index' 

import Navbar from '../components/Navbar.vue'
import WeatherOverview from '../components/WeatherOverview.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Navbar,
    WeatherOverview,
    Footer
  },
  data() {
    return {
      dataCategory: 'F-B0053-035',
      dataType: 'JSON',
      dataset: {
        locations: {
          location: []
        }
      }
    }
  },
  methods: {
    async fetchDataset() {
      try {
        const dataCategory = this.dataCategory
        const dataType = this.dataType
        const response = await indexAPI.test({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }
        this.dataset = {
          ...response.data.dataset
        }
        this.getEachDayHighestLowestTemperature()
      } catch (error) {
        console.warn(error)
      }
    },
  },
  mounted() {
    this.fetchDataset()
  }
}
</script>
