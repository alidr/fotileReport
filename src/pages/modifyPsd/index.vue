<template>
  <!-- 修改密码 -->
  <div id="ModifyPsd">
    <div class="ModifyPsdContent">
      <div class="input">
        <img src="./newPsd.png" alt="">
        <span>原密码</span>
        <input type="password" placeholder="请输入原密码（8个字母或数字）" maxlength="8" v-model="oldPsd">
      </div>
      <div class="input">
        <img src="./oldPsd.png" alt="">
        <span>新密码</span>
        <input type="password" placeholder="请输入新密码（8个字母或数字）" maxlength="8" v-model="newPsd">
      </div>
      <div class="input">
        <img src="./againPsd.png" alt="">
        <span>确认密码</span>
        <input type="password" placeholder="请输入新密码（8个字母或数字）" maxlength="8" v-model="rePsd">
      </div>
    </div>
    <a href="javascript:;" id="button" @click="commitPsd">确认修改</a>
  </div>
</template>
<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex'
export default {
  data(){
    return{
      oldPsd:'',
      newPsd:'',
      rePsd:''
    }
  },
  methods:{
    commitPsd(){
      if (!this.oldPsd) {
        this.getToast("请输入原密码",'warn')
        return
      }else if(!this.newPsd){
        this.getToast("请输入新密码",'warn')
        return
      }else if (!this.rePsd) {
        this.getToast("请输入确认密码",'warn')
        return
      }else if (this.newPsd!==this.rePsd) {
        this.getToast("两次密码不一致",'warn')
        return
      }
      this.axiosloading()
      axios({
        url:this.getHost()+'/UserInfo/Password', 
        method:'post',
        data:qs.stringify({
          OldPass: this.oldPsd,
          NewPass: this.newPsd,
          UserId:getCookie('UserId'),
          token:getCookie('token')
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("修改成功",'correct')
          this.delCookie("UserId")
          this.delCookie("token")
          this.setAccessId('')
          location.replace('/')
        }else if (res.data.Status<0) {
          this.delCookie("UserId")
          this.delCookie("token")
          this.setAccessId('')
          location.replace('/')
        }
        else{
          this.getToast(res.data.Message,'warn')
        }
      })
      .catch(res=>{
        this.getToast(res.data.Message,'warn')
      })
    },
        ...mapMutations({
    setAccessId: 'SET_ACCESSID'
    })
  }
  
}
</script>
<style scoped>
@import '../../common/input.css';
#ModifyPsd{
  padding-top: 15px;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
}
.ModifyPsdContent{
  background-color: #fff;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.input img{
  width: 25px;
}
.input span{
  margin-left: 10px;
}
#button{
  width: calc(100% - 80px);
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

</style>


