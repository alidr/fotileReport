<template>
  
</template>
<script>
  import { mapMutations } from 'vuex';
  import axios from "axios";
  import qs from "qs";
export default {
  data(){
    return{
      code:'',
      Id:'',
      AccessId: ''
    }
  },
  created(){
    this.code = this.getSearchParam('code')
    this.Id = this.$route.query.id
    this.sendParam()
  },
  methods:{
    getSearchParam(key) {
      var ret = location.search.match(new RegExp('(\\?|&)' + key + '=(.*?)(&|$)'))
      return ret && decodeURIComponent(ret[2])
    },
    sendParam(){
      axios({
            url: this.getHost() + '/Login/BindOpenId',
             params: {
              Id:this.Id,
              code:this.code
            },
            method: 'get',
          })
          .then(res => {
            if (res.data.Status == 1) {
              this.AccessId = res.data.Data.JobID
              this.setAccessId(this.AccessId)
              let cookie = res.data.Data.Token
              let id = res.data.Data.ID
              let Name = res.data.Data.Name
              let Organization = res.data.Data.Organization
              this.addCookie('token', cookie, 1)
              this.addCookie('UserId', id, 1)
              this.addCookie('Name', Name, 1)
              this.addCookie('Organization', Organization, 1)
              if (this.AccessId == -1) {
                this.$router.push({
                  path: '/adminIndex'
                })
              } else {
                // this.$router.push({
                //   path: '/home'
                // })
                location.href = "/#/home"
              }
            } else if (res.data.Status == 0) {
              const toast = this.$createToast({
                txt: res.data.Message,
                mask: true,
                type: 'warn',
                maskClosable: true,
                time: 1000,
              })
              toast.show()
              return
            }else if (res.data.Status == 403) {
              window.location.href = res.data.Message
            }
          })
      },
        ...mapMutations({
        setAccessId: 'SET_ACCESSID'
      })
  },
}
</script>
<style scoped>

</style>


