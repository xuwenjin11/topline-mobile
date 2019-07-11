// 频道列表api
import request from '@/utils/request.js'

export const getUserChannels = () => {
  return request({
    methos: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
