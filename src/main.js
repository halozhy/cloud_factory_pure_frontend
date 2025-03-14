import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// import axios from 'axios'

import axios from './mock'; // 引入 Mock 后的axios

Vue.prototype.$axios = axios // 全局注册，使用方法为:this.$axios

Vue.prototype.pageList = function(page, limit, list) {
  var pageList = []
  var temp = []
  var cnt = 0
  for (let index = 0; index < list.length; index++) {
    const element = list[index]
    cnt = cnt + 1
    temp.push(element)
    if (cnt === limit) {
      cnt = 0
      pageList.push(temp)
      temp = []
    }
  }
  pageList.push(temp)
  return pageList[page - 1]
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
