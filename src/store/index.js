import Vue from 'vue'
import Vuex from 'vuex'
import store from '../store/index'
import indexAPI from '../api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    datasetOneWeekDayNight: {
      locations: {
        location: []
      }
    },
    datasetPerThreeHours: {
      locations: {
        location: []
      }
    },
    isFetchDatasetOneWeek: false
  },
  getters: {
  },
  mutations: {
    setDatasetOneWeek(state, data) {
      state.datasetOneWeek = {
        ...data,
      }
    },
  },
  actions: {
    async fetchDatasetOneWeek({ commit }) {
      try {
        const dataCategory = store.state.dataCategory.oneWeek
        const dataType = store.state.dataType
        const response = await indexAPI.test({ dataCategory, dataType })
        if (response.status !== 200) {
          throw new Error()
        }
        const data = {
          ...response.data.dataset
        }
        commit('setDatasetOneWeek', data)
        return true
      } catch (error) {
        console.warn(error)
        return false
      }
    },
  },
  modules: {
  }
})
