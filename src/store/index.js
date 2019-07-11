import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 获取token
    user: JSON.parse(window.localStorage.getItem('user'))
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 持久化本地存储，防止刷新页面数据登录状态信息丢失
      window.localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {

  }

})
