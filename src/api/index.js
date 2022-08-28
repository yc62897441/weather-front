import { apiHelper } from '../utils/helpers'

export default {
  test({ dataCategory, dataType }) {
    const searchParams = new URLSearchParams({ dataCategory, dataType })
    return apiHelper.get(`/test?${searchParams.toString()}`)
  }
}