import axios from 'axios'
import store from '@/store'
// 引入json-bigint包，对id超出安全范围的数据进行处理
import JSONbig from 'json-bigint'
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

/**
 * 处理后端返回数据中数字超出 JavaScript 安全整数范围
 */

request.defaults.transformResponse = [function (data) {
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]
// 响应拦截
request.interceptors.response.use(function (response) {
  return response.data.data || response.data
}, function (error) {
  return Promise.reject(error)
})

export default request
