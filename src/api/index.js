import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  getWeatherData({ dataCategory, dataType }) {
    const searchParams = new URLSearchParams({ dataCategory, dataType })
    return apiHelper.get(`/weather_data?${searchParams.toString()}`)
  },
  signup({ formData }) {
    return apiHelper.post(`/users/signup`, formData)
  },
  signin({ formData }) {
    return apiHelper.post(`/users/signin`, formData)
  },
  getCurrentUser: () => {
    return apiHelper.get('/get_current_user', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUserSave() {
    return apiHelper.get('/users/userSave')
  },
  addToUserSave({ formData }) {
    return apiHelper.post(`/users/addToUserSave`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  removeFromUserSave({ formData }) {
    return apiHelper.post(`/users/removeFromUserSave`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  getUserNotification() {
    return apiHelper.get('/users/notification')
  },
  onNotify({ formData }) {
    return apiHelper.post(`/users/onNotify`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  offNotify({ formData }) {
    return apiHelper.post(`/users/offNotify`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}