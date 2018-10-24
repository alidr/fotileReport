import axios from "axios";
export default {
  install(Vue, options) {
    //
    Vue.prototype.getToast = function (txt, type) {
       const toast = this.$createToast({
         txt,
         mask: true,
         type,
         maskClosable: true,
         time: 1000,
       })
       toast.show()
    }

    // Vue.prototype.getLoadingToast = function (txt, type) {
    //   const loadingToast = this.$createToast({
    //     time: 0,
    //     txt: '加载中',
    //     type: 'loading'
    //   })
    //   return loadingToast
    // }

    Vue.prototype.axiosloading = function (txt, type) {
      // 添加请求拦截器
      const loadingToast = this.$createToast({
        time: 0,
        txt: '加载中',
        type: 'loading'
      })　
      axios.interceptors.request.use(function (config) {　
         // 在发送请求之前做些什么
        loadingToast.show()　　
        return config
      }, function (error) {　　 // 对请求错误做些什么
        return Promise.reject(error)
      });

      // 添加响应拦截器
      axios.interceptors.response.use(function (response) {　　 // 对响应数据做点什么
        loadingToast.hide()　　　
        return response
      }, function (error) {　　 // 对响应错误做点什么
        　　
        return Promise.reject(error)
      });
    }
  }
}
