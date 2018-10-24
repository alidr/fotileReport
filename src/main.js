// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './common/common.css';
import Cube from 'cube-ui';
Vue.use(Cube)

import cookie from './utils/cookie.js'
Vue.use(cookie);

import getHost from './utils/getHost.js'
Vue.use(getHost);

import getToast from './utils/Toast.js'
Vue.use(getToast);

Vue.config.productionTip = false
import  VueAwesomeSwiper from 'vue-awesome-swiper'
import  'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import gallery from 'img-vuer'
Vue.use(gallery, {
  swipeThreshold: 150  // default 100 ,new in 0.12.0
})
// import './utils/vconsole.js'
// loadingToast
// 添加请求拦截器
// axios.interceptors.request.use(function (config) {　　 // 在发送请求之前做些什么
//   toast.show()
//   return config
// }, function (error) {　　 // 对请求错误做些什么
//   return Promise.reject(error)
// });

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {　　 // 对响应数据做点什么
//   toast.hide()　
//   return response
// }, function (error) {　　 // 对响应错误做点什么
//   　　
//   return Promise.reject(error)
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
