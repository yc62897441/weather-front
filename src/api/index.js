import { apiHelper } from '../utils/helpers'

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
}