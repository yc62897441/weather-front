<template>
  <div class="home">
    <Spinner v-if="isLoading" />
    <WeatherOverview class="WeatherOverview" v-else v-bind:propDatasetOneWeek="propDatasetOneWeek" />
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
      propDatasetOneWeek: {},
      userSave: [],
      isLoading: true
    }
  },
  methods: {
    async fetchDatasetOneWeekAndUserSave() {
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

        const responseUserSave = await indexAPI.getUserSave()
        if (responseUserSave.data.userSaves) {
          responseUserSave.data.userSaves.forEach(item => {
            this.userSave.push(item.MountainId)
          })
        }

        const location = []
        this.datasetOneWeek.locations.location.forEach(item => {
          if (this.userSave.includes(item.parameterSet.parameter.parameterValue)) {
            location.push(item)
          }
        })

        this.propDatasetOneWeek = {
          datasetInfo: response.data.dataset.datasetInfo,
          locations: {
            location: location,
            locationsName: response.data.dataset.locations.locationsName
          }
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.warn(error)

        // 當 token 過期，刪除 store user資料，導回登入夜面
        if (error.message === 'Request failed with status code 401') {
          Toast.fire({
            icon: 'error',
            title: '權限存取有誤，請重新登入'
          })
          this.$store.commit('revokeAuthentication')
          this.$router.push({ path: '/signin' })
        }
      }
    },
  },
  mounted() {
    this.fetchDatasetOneWeekAndUserSave()
  }
}
</script>

<style>

</style>