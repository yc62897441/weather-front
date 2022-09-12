import { apiHelper } from '../utils/helpers'
const getToken = () => localStorage.getItem('token')

export default {
  test({ dataCategory, dataType }) {
    const searchParams = new URLSearchParams({ dataCategory, dataType })
    return apiHelper.get(`/test?${searchParams.toString()}`)
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
  addToUserSave({ formData }) {
    return apiHelper.post(`/users/addToUserSave`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  },
  removeFromUserSave({ formData }) {
    return apiHelper.post(`/users/removeFromUserSave`, formData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
  }
}