<template>
  <div class="home">
    <Navbar />
    <WeatherOverview v-bind:propDatasetOneWeek="datasetOneWeek" />
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
      userSave: []
    }
  },
  methods: {
    async fetchDatasetOneWeekAndUserSave() {
      try {
        const dataCategory = this.dataCategory.oneWeek
        const dataType = this.dataType
        const response = await indexAPI.test({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }

        const responseUserSave = await indexAPI.getUserSave()
        if (responseUserSave.data.userSaves) {
          responseUserSave.data.userSaves.forEach(item => {
            this.userSave.push(item.MountainId)
          })
        }

        const location = []
        response.data.dataset.locations.location.forEach(item => {
          if (this.userSave.includes(item.parameterSet.parameter.parameterValue)) {
            location.push(item)
          }
        })

        this.datasetOneWeek = {
          datasetInfo: response.data.dataset.datasetInfo,
          locations: {
            location: location,
            locationsName: response.data.dataset.locations.locationsName
          }
        }
      } catch (error) {
        console.warn(error)
      }
    },
  },
  mounted() {
    this.fetchDatasetOneWeekAndUserSave()
  }
}
</script>
