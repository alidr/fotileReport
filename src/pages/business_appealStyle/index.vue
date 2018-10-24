<template>
  <!-- 跟进类型 -->
  <div id="appealStyle">
    <p class="btn btn1" @click="jump(1)">申请跟进权</p>
    <p class="btn btn2" @click="jump(2)">申请延长保护期</p>
    <p class="btn btn3" @click="jump(3)">特殊报备</p>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
export default {
  name: 'appealStyle',
  data () {
    return {
      queryString: '',
      id:''
    }
  },
  created () {
    this.id = this.$route.query.id;
    this.name = sessionStorage.getItem("companyName")
    // console.log(this.$route.query);
  },
  methods:{
    jump(num){
      //  this.queryString.applyType = num;
       if (num ==1) {
          axios({
          url:this.getHost()+'/Company/VerifyCompany', 
          method:'post',
            data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            CategoryID:this.id,
            Name:this.name
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            console.log(res.data.Data.UserID == getCookie('UserId'));
            
            if (res.data.Data.UserID == getCookie('UserId')) {
              this.getToast("该公司已经在您的名下，不需要申诉",'warn')
              return
            }
            if (res.data.Data.Code==2) {
              sessionStorage.setItem("ComInfo",JSON.stringify(res.data.Data))
              this.$router.push({
                path: '/appealFollowUp',
                query:{
                  applyType:1
                }
              })
            }
             if(res.data.Data.Code==3){
              this.getToast("该公司已签约，不可申诉",'warn')
              setTimeout(() => {
                this.$router.push({
                path: '/home'
              })
              }, 2000);
            }
            if(res.data.Data.Code==0||res.data.Data.Code==-1||res.data.Data.Code==1){
              this.getToast("该公司可直接申请，不需要跟进权",'warn')
              setTimeout(() => {
                this.$router.push({
                path: '/home'
              })
              }, 2000);
            }
          }else if (res.data.Status<0) {
            this.getToast("登录失效，请重新登录",'warn')
            setTimeout(() => {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            }, 2000);
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
       } else if (num ==2) {
         if (sessionStorage.getItem('UserID') == getCookie('UserId')) {
           this.$router.push({
            path: '/appealMaterial',
            query: {
              applyType:num
            }
          })
         }else{
           this.getToast("该公司不再您的名下,不能延长保护期",'warn')
         }
       }
       else {
          this.$router.push({
          path: '/appealMaterial',
          query: {
            applyType:num
          }
        })
       }
       
      // if (num==1) {
       
      //   this.$router.push({
      //     path: '/appealMaterial',
      //     query: this.queryString 
      //   })
      // }else if(num ==2){

      //   this.$router.push({
      //     path: '/appealMaterial',
      //     query: {
      //       page: num
      //     }
      //   })
      // }  else if (num ==3) {
      //    this.$router.push({
      //     path: '/appealMaterial',
      //     query: this.queryString 
      //   })
      // }
    },
  }
}
</script>

<style scoped>
#appealStyle{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.btn{
  width: 220px;
  height: 45px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #fff
}
.btn1{
  background-image: linear-gradient(45deg, #e2c78f, #e1c48a, #d5ae61)
}
.btn2{
  color: #d5ae61;
  border: 1px solid #d5ae61;
  box-sizing: border-box;
}
.btn3{
  background-color:#71788c
}
</style>
