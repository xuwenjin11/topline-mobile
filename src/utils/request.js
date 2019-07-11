import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
  // baseURL: 'http://toutiao.course.itcast.cn'
})

// 请求拦截
request.interceptors.request.use(function (config) {
  // 如果登录了给登录用户添加统一token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截
request.interceptors.response.use(function (response) {
  return response.data.data || response.data
}, function (error) {
  return Promise.rejest(error)
})

export default request
