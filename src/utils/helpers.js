import axios from 'axios'

let baseURL = ''
if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://side-project-weather-end.herokuapp.com/api'
} else {
  baseURL = 'http://localhost:3000/api'
}

const axiosInstance = axios.create({
  baseURL
})

axiosInstance.interceptors.request.use(config => {
  // 從 localStorage 將 token 取出
  const token = localStorage.getItem('token')
  // 如果 token 存在的話，則帶入到 headers 當中
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

export const apiHelper = axiosInstance

// sweetalert2
import Swal from 'sweetalert2'
export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: true,
  timer: 3000,
  color: '#000000',
})
