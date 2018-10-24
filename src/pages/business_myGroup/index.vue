<template>
<!-- 我的小组 -->
  <div id="myGroup">
    <p class="title">
      <span>当前小组共{{list.length}}人，组长为{{zuzhang}}。</span>
      <span @click="memberCompany" v-if="follow">查看跟进公司</span>
    </p>
    <div class="groupList" v-for="(item,index) in list" :key="index" >
      <div class="name">
        <i></i>
        <span>{{item.Name}}</span>
      </div>
      <div class="teamMemberInfo">
        <p>手机号 {{item.Mobile}}</p>
        <p>跟进{{item.TotalCount}}家装公司，{{item.Count}}家已签约</p>
      </div>
      <div class="icon" v-if="item.IsHead">
        <span>组长</span>
      </div>
      <i class="topIcon">{{index+1}}</i>
    </div>
   <a href="javascript:;" id="button" @click="deleteShopMask" v-if="btn">解散小组</a>
   <div id="mask" v-show="deleteShopWarn">
      <div class="maskContain">
        <div class="content">
          确认要解散吗？
        </div>
        <div class="btn">
          <span class="cancel" @click="deleteShopMask(false)">取消</span>
          <span class="confirm" @click="dissolutionTeam">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'myGroup',
  data(){
    return{
      ID:'',
      list:[],
      zuzhang:'',
      deleteShopWarn:false,
      zuzhangId:'',
      follow:false,
      btn:false,
      style:''
    }
  },
  created(){
    this.ID = this.$route.query.id
    this.style= this.$route.query.style   
    if (this.AccessId ==4) {
      this.btn = true
    }
    if (this.style==1) {
       this.getMember()
    }else if(this.style==2){
      this.getMyMember()
    }
   
    
  },
   computed: {
    ...mapGetters([
      'AccessId'
    ])
  },
  methods:{
    deleteShopMask(bool){
      this.deleteShopWarn = bool;
    },
    memberCompany(){
      this.$router.push({path:'/CompanyFollow'})
    },
    getMyMember(){
      axios({
        url:this.getHost()+'/UserInfo/GetGroupUserByUserID', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token')
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.list = res.data.Data.list
          this.list.filter(item=>{
            if (item.IsHead) {
              this.zuzhang = item.Name
              this.zuzhangId = item.ID
            }
          })
          if (getCookie('UserId')==this.zuzhangId) {
            this.follow = true
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
    },
    getMember(){
      axios({
        url:this.getHost()+'/UserInfo/GetGroupUserByID', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Id:this.ID
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.list = res.data.Data.list
          this.list.filter(item=>{
            if (item.IsHead) {
              this.zuzhang = item.Name
              this.zuzhangId = item.ID
            }
          })
          if (getCookie('UserId')==this.zuzhangId) {
            this.follow = true
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
    },
    dissolutionTeam(){
      axios({
        url:this.getHost()+'/UserInfo/DissolveGroupByID', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Id:this.ID
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("解散成功",'warn')
          this.deleteShopMask(false)
          setTimeout(() => {
            this.$router.push({
              path:'/allgroups'
            })
          }, 2000);
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
    }
  }
}
</script>

<style scoped>
@import '../../common/mask.css';
#myGroup{
  padding: 15px;
  box-sizing: border-box;
}
.title{
  width: 100%;
  height: 25px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
}
.title span{
  display: flex;
  height: 100%;
  align-items: center;
}
.title span:first-child{
  background-color: #DFDEDD;
  width: 0;
  flex-grow: 1;
  padding-left: 10px;
}
.title span:nth-child(2){
  background-color: #D4A667;
  padding:0 10px;
  margin-left: 10px;
  border-radius: 4px;
}
.groupList{
  background-color: #fff;
  margin-top: 10px;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  align-items: center;
  font-size: 12px;
  position: relative;
}
.name{
  width: 100px;
  border-right: 1px solid #f0f0f0;
  margin-right: 15px;
  font-size: 14px;
  display: flex;
}
.name i{
  width: 6px;
  height: 6px;
  background-color: #ccc;
  border-radius: 3px;
  display: inline-block;
  margin-right: 5px;
  margin-top: 4px;
}
.name span{
    width: 70%;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
 
}
.teamMemberInfo{
  width: 0;
  flex-grow: 1;
}
.teamMemberInfo p:first-child{
  margin-bottom: 10px;
}
.teamMemberInfo p:nth-child(2){
  color: #999;
}
.icon{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: 1px  solid #E2C78F;
  color: #E2C78F;
  display: flex;
  justify-content: center;
  align-items: center;
}
.topIcon{
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  border-radius:4px 0px 14px;
  background-color: #D4A667;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
#button{
  width: calc(100% - 80px);
  margin: 30vh auto;
  background-image: linear-gradient(#ccc);
}
</style>
