export default {
    install(Vue, options) {
        //添加cookie
        Vue.prototype.getHost = function() {
            //测试地址
            // const getHost = "https://bbapi.efotile.com/api"
            const getHost = "https://crapi.efotile.com/api"
            return getHost
        }
        global.getHost = Vue.prototype.getHost;

        Vue.prototype.getImgHost = function() {
            // const getImgHost = "https://bbapi.efotile.com/"
            const getImgHost = "https://crapi.efotile.com/"
            return getImgHost
        }
    }
}