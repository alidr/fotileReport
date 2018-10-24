<template>
<!-- 新建用户 -->
  <div id="addUser">
    <div class="info">
      <div class="input">
        <span>姓名</span>
        <input type="text" placeholder="请输入员工姓名" v-model='name' :readonly="dealer">
      </div>
      <div class="input" >
        <span>职位</span>
        <input type="text" v-model='JobInfo' readonly :JobId='JobId'>
      </div>
      <div class="input">
        <span>上级</span>
        <input type="text" placeholder="请选择负责人" v-model="LastInfo" readonly
        :LastId='LastId'>
      </div>
       <div class="input">
        <span>组织名称</span>
        <input type="text" placeholder="请输入组织名称" v-model="Organization" :readonly="dealer">
      </div>
    </div>
     <div class="info">
      <div class="input">
        <span>手机号码</span>
        <input type="text" placeholder="请输入员工手机号" v-model="tel" readonly>
      </div>
       <div class="input">
        <span>小组信息</span>
        <input type="text"  v-model="group" readonly>
      </div>
      <div class="input">
        <span>密码</span>
        <input type="password" placeholder="******" v-model="password" maxlength="8" :readonly="dealer">
      </div>
      <div class="input">
        <span>确认密码</span>
        <input type="password" placeholder="******" v-model="rePassword" maxlength="8" :readonly="dealer">
      </div>
    </div>
    <div class="btn">
      <a href="javascript:;" id="button" @click="commitUserInfo" v-if="!dealer">确认保存</a>
      <!-- <router-link to="/adminIndex" id="button">取消</router-link> -->
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex'
export default {
  data(){
    return{
      JobInfo:'',
      JobId:0,
      LastInfo:'',
      LastId:0,
      lastPerson:true,
      name:'',
      Organization:'',
      tel:'',
      password:'',
      rePassword:'',
      group:'',
      id:'',
      dealer:false
    }
  },
   computed: {
    ...mapGetters([
      'AccessId'
    ])
  },
  mounted () {
    this.id =this.$route.query.id
    this.getInfo(this.id)
    if (this.AccessId==4) {
      this.dealer=true
    }
    // this.getPickerConfig()
  },
  methods: {
    getInfo(id){
      this.axiosloading()
      axios({
        url:this.getHost()+'/UserInfo/GetUserByID', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Id:id,
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          const data = res.data.Data
          this.name = data.Name
          this.JobInfo = data.JobName
          this.LastInfo = data.ParentName
          this.Organization = data.Organization
          this.tel = data.Mobile
          this.group = data.GroupName
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
    },
    //提交新增用户信息
    commitUserInfo(){
      if (!this.name) {
        this.getToast("请输入姓名",'warn')
      }else if (!this.Organization) {
        this.getToast("请输入组织名称",'warn')
      }else if (this.password !==this.rePassword) {
        this.getToast("两次密码不一致",'warn')
      }else{
        this.axiosloading()
        axios({
          url:this.getHost()+'/UserInfo/SaveUserInfo', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Password:this.password,
            JobID:this.JobId,
            ParentID:this.LastId,
            Organization:this.Organization,
            Mobile:this.tel,
            ID:this.id,
            Name:this.name
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.getToast("编辑用户成功，跳转首页",'warn')
            setTimeout(() => {
              if (this.AccessId==-1) {
                this.$router.push({path:'/adminIndex'})
              }else{
                this.$router.push({path:'/home'})
              }  
            }, 2000);
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
      }
    }
  }
}
</script>

<style scoped>
@import '../../common/input.css';
#addUser{
  padding-top: 10px;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}
.info{
  padding: 0 10px;
  background-color: #fff;
  margin-bottom: 10px;
}
.info .input:last-child{
  border:none !important;
}
.input input,.input .arrow{
  margin-right: 0 !important;
}
.btn{
  margin-top: 20vh;
}
.btn #button{
  width: calc(100% - 80px);
  margin: 0 auto;
}
.btn #button:first-child{
  margin-bottom: 15px;
}
.btn #button:nth-child(2){
  background-image: linear-gradient(#ccc);
}
</style>
