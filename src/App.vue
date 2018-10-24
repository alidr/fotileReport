<template>
  <div id="app">
    <a href="javascript:;" @click="back" id="fixBack" v-show="needBack&&isminprograme">
      <!-- <i class="iconfont icon-fanhui"></i> -->
      <span>返回</span>
    </a>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminRouer from './router/adminRouter.js'
import BusinessRouter from './router/businessRouter.js'
import DealerRouter from './router/dealerRouter.js'
import ManagerRouter from './router/managerRouter.js'

export default {
  name: 'App',
  data(){
    return{
      isminprograme: false,
      needBack:false
    }
  },
  computed: {
    ...mapGetters([
      'AccessId'
    ])
  },
  watch: {
    'AccessId': function() {
      this.initRouter()
    },
    '$route': function (to, from) {
      // this.calc_transitionName(to, from)
      if (to.name === 'Home' || to.name === 'Login'||to.name === 'AdminIndex') {
        this.needBack = false
      } else {
        this.needBack = true
      }
    }
  },
  created(){
    let that = this
    function ready() {
      if (window.__wxjs_environment === 'miniprogram') {
        that.isminprograme = true
      }
    }
    /* eslint-disable no-undef */
    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
      document.addEventListener('WeixinJSBridgeReady', ready, false)
    } else {
      ready()
    }
  },
  methods: {
    afterEnter() {
      console.log('afterEnter')
    },
    back() {
      this.$router.back()
    },
    initRouter() {
      let AccessId = this.AccessId
      if (AccessId == -1) {
        this.$router.addRoutes(AdminRouer)
      } else if (AccessId == 5) {
        this.$router.addRoutes(BusinessRouter)
      } else if (AccessId == 4) {
        this.$router.addRoutes(DealerRouter)
      }else if (AccessId == 3 ||AccessId == 2||AccessId == 1) {
        this.$router.addRoutes(ManagerRouter)
      }
      this.$router.addRoutes([{
        path: '*',
        redirect: '/404'
      }])
    }
  },
  mounted() {
    if (this.AccessId) {
      this.initRouter()
    }
  }
}
</script>

<style>
#app {
  font-size: 14px;
  height: 100%;
}
#uploadContract .cube-upload .cube-upload-file, .cube-upload-btn{
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}
#uploadContract .cube-upload-file-def{
  width: 100% !important;
  height: 60vh !important;
}
#uploadContract .cube-upload-btn-def{
  width: 100% !important;
  height: 60vh !important;
  background-color: #f0f0f0;
}

 .cube-upload-file + .cube-upload-btn {
      margin-top: -200px;
      opacity: 0;
 }
 #fixBack{
    position: fixed;
    left: 0;
    top: 11vh;
    width: 50px;
    height: 40px;
    background-color: rgba(0,0,0,.3);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 4px 4px 0px;
    color: #fff
 }
.HomeDecoration .cube-pullup-wrapper .before-trigger{
  padding: 10px 0!important;
}
 /* loading */
 
  .cube-loading{
    position: absolute !important;
    top: 0 !important;left: 0 !important;bottom: 0 !important;right: 0 !important;
    margin: auto !important;

  }
  
.cube-loading-spinners {
    position: absolute !important;
    display: block !important;
    width: 1em !important;
    height: 1em !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    margin: auto !important;
}

.swiper-container{
  margin: 14% auto !important;
}

</style>
