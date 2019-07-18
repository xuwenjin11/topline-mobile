import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 获取token
    user: auth.getUser()
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 持久化本地存储，防止刷新页面数据登录状态信息丢失
      auth.saveUser(state.user)
    }
  },
  actions: {

  }

})
