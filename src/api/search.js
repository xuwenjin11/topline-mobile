import request from '@/utils/request.js'

// 用户搜索联想
export const userSearch = (q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
