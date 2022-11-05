import Vue from 'vue'
import Vuex from 'vuex'
import store from '../store/index'
import indexAPI from '../api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataCategory: {
      oneWeek: 'F-B0053-031', //登山一週24小時天氣預報
      // oneWeekDayNight: 'F-B0053-033', //登山一週日夜天氣預報 33
      perThreeHours: 'F-B0053-035' //登山三天3小時天氣預報
    },
    dataType: 'JSON',
    // datasetOneWeek: {
    //   locations: {
    //     location: []
    //   }
    // },
    // datasetPerThreeHours: {
    //   locations: {
    //     location: []
    //   }
    // },
    isFetchDatasetOneWeek: false,
    isFetchDatasetPerThreeHours: false,
    currentUser: {
      id: -1,
      account: '',
      LINE_USER_ID: null
    },
    token: '',
    isAuthenticated: false,
    darkMode: false
  },
  getters: {
  },
  mutations: {
    // setDatasetOneWeek(state, data) {
    //   state.datasetOneWeek = {
    //     ...data,
    //   }
    // },
    // setDatasetPerThreeHours(state, data) {
    //   state.datasetPerThreeHours = {
    //     ...data,
    //   }
    // },
    setCurrentUser(state, currentUser) {
      // 將資料存到 state 中，供所有 vue 元件取用
      state.currentUser = {
        ...state.currentUser,
        // 將 API 取得的 currentUser 覆蓋掉 Vuex state 中的 currentUser
        ...currentUser
      }
      // 將使用者的登入狀態改為 true
      state.isAuthenticated = true
      // 將使用者驗證用的 token 儲存在 state 中
      state.token = localStorage.getItem('token')
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
    },
    switchDarkMode(state, data) {
      state.darkMode = data
    }
  },
  actions: {
    // async fetchDatasetOneWeek({ commit }) {
    //   try {
    //     const dataCategory = store.state.dataCategory.oneWeek
    //     const dataType = store.state.dataType
    //     const response = await indexAPI.getWeatherData({ dataCategory, dataType })
    //     if (response.status !== 200) {
    //       throw new Error()
    //     }
    //     const data = {
    //       ...response.data.dataset
    //     }
    //     commit('setDatasetOneWeek', data)
    //     return true
    //   } catch (error) {
    //     console.warn(error)
    //     return false
    //   }
    // },
    // async fetchDatasetPerThreeHours({ commit }) {
    //   try {
    //     const dataCategory = store.state.dataCategory.perThreeHours
    //     const dataType = store.state.dataType
    //     const response = await indexAPI.getWeatherData({ dataCategory, dataType })
    //     if (response.status !== 200) {
    //       throw new Error()
    //     }
    //     const data = {
    //       ...response.data.dataset
    //     }
    //     commit('setDatasetPerThreeHours', data)
    //     return true
    //   } catch (error) {
    //     console.warn(error)
    //     return false
    //   }
    // },
    async fetchCurrentUser({ commit }) {
      try {
        // 每次路由改變(如重新整理)時，都會再去 getCurrentUser，並且用 setCurrentUser 將資料存到 vuex state 中
        // 如果沒有加這個，路由改變時，state 的 currentUser 就會變回預設空空的內容
        const response = await indexAPI.getCurrentUser()
        if (response.statusText !== 'OK') {
          throw new Error(response.statusText)
        }
        const data = response.data
        commit('setCurrentUser', data)
        return true
      } catch (error) {
        console.warn(error)
        return false
      }
    }
  },
  modules: {
  }
})
