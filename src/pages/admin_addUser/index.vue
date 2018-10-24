<template>
<!-- 新建用户 -->
  <div id="addUser">
    <div class="info">
      <div class="input">
        <span>姓名</span>
        <input type="text" placeholder="请输入员工姓名" v-model='name'>
      </div>
      <div class="input"  @click="showPicker">
        <span>职位</span>
        <input type="text" placeholder="请选择员工职位" v-model='JobInfo' readonly :JobId='JobId'>
        <i class="arrow"></i>
      </div>
      <div class="input" @click="showLastPicker" v-if="lastPerson">
        <span>上级</span>
        <input type="text" placeholder="请选择负责人" v-model="LastInfo" readonly
        :LastId='LastId'>
        <i class="arrow"></i>
      </div>
       <div class="input">
        <span>组织名称</span>
        <input type="text" placeholder="请输入组织名称" v-model="Organization">
      </div>
    </div>
     <div class="info">
      <div class="input">
        <span>手机号码</span>
        <input type="text" placeholder="请输入员工手机号" v-model="tel">
      </div>
      <div class="input">
        <span>密码</span>
        <input type="password" placeholder="请输入密码" v-model="password" maxlength="8" >
      </div>
      <div class="input">
        <span>确认密码</span>
        <input type="password" placeholder="请输入确认密码" v-model="rePassword" maxlength="8">
      </div>
    </div>
    <div class="btn">
      <a href="javascript:;" id="button" @click="commitUserInfo">确认添加</a>
      <!-- <router-link to="/adminIndex" id="button">取消</router-link> -->
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
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
      rePassword:''

    }
  },
  mounted () {
    this.getPickerConfig()
  },
  methods: {
    //获取职位
    getPickerConfig() {
      this.axiosloading()
      axios({
        url:this.getHost()+'/Notice/JobInfo', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token')
        })
      })
      .then(res=>{
        if (res.data.Status===1) {
          this.initPicker(res.data.Data.list)
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
    //获取上一级负责人数据
    getPickLastData(key){
      console.log(key)
      this.axiosloading()
      axios({
        url:this.getHost()+'/UserInfo/GetParentUserList', 
        method:'post',
        data:qs.stringify({
          Id:key,
          UserId:getCookie('UserId'),
          token:getCookie('token')
        })
      })
      .then(res=>{
        if (res.data.Status===1) {
          if (res.data.Data.list.length==0) {
            this.lastPerson = false
          }else{
             this.lastPerson = true
          }
          this.initLastPicker(res.data.Data.list)
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
    //配置职位picker
    initPicker(data){
      this.picker = this.$createPicker({
        title: '选择职位',
        alias: {
          value: 'ID',
          text: 'Name'
        },
        data: [data],
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.LastInfo = ""
          this.JobInfo = selectedText
          this.JobId = selectedVal[0]
          this.getPickLastData(this.JobId)
        },
        onCancel: () => {
          this.getToast("取消选择",'correct')
        }
      })
    },
    //配置上级负责人picker
    initLastPicker(data){
      this.Lastpicker = this.$createPicker({
        title: '选择负责人',
        alias: {
          value: 'ID',
          text: 'Name'
        },
        data: [data],
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.LastInfo = selectedText
          this.LastId = selectedVal[0]
        },
        onCancel: () => {
          this.getToast("取消选择",'correct')
        }
      })
    },
    //显示职位picker
    showPicker () {
      this.picker.show()
    },
    //显示上一级负责人picker
    showLastPicker () {
       if (!this.JobInfo) {
        this.getToast("请先选择职位",'warn')
       }else{
         this.Lastpicker.show()
       }
    },
    //提交新增用户信息
    commitUserInfo(){
      if (!this.name) {
        this.getToast("请输入姓名",'warn')
      }else if (!this.JobInfo) {
        this.getToast("请选择职位",'warn')
      }else if (this.JobId!==1&&!this.LastInfo) {
        this.getToast("请选择上级",'warn')
      }else if (!this.Organization) {
        this.getToast("请输入组织名称",'warn')
      }else if(!this.tel){
        this.getToast("请输入手机号",'warn')
       }
      //else if(this.tel.length<11){
      //   this.getToast("手机号码格式不正确",'warn')
      // }
      else if (!this.password) {
        this.getToast("请输入密码",'warn')
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
            ID:0,
            Name:this.name
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.getToast("新建用户成功，跳转首页",'warn')
            setTimeout(() => {
              this.$router.push({path:'/home'})
            }, 2000);
          }else if (res.data.Status<0) {
            this.delCookie("UserId")
            this.delCookie("token")
            this.setAccessId('')
            location.replace('/')
          }
          else{
            this.getToast(res.data.Message,'warn')
            setTimeout(() => {
              this.$router.push({path:'/addUser'})
            }, 2000);
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
