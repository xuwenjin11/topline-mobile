import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入rem基准值
import 'amfe-flexible'

// 项目初期先将所有组件导入进来，后期调整进行按需引入，减少打包体积
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import relativeTime from './filters/relative-time'
Vue.use(VeeValidate, {
  events: '' // 禁止默认事件验证
})
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)
Vue.use(Lazyload)
// 注册一个全局过滤器
Vue.filter('relativeTime', relativeTime)

// 按需引入vant框架
// import {
//   Button,
//   Tabbar,
//   TabbarItem
// } from 'vant'
// 引入vant框架样式
// import 'vant/lib/index.css'

// Vue
//   .use(Button)
//   .use(Tabbar)
//   .use(TabbarItem)
Vue.config.productionTip = false

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
