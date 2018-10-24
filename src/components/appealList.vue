<template>
   <div class="home_content" v-if="list.length">
      <div class="focus">
       最新申诉({{list.length}})
      </div>
      <div class="contentList" v-for="(item,index) in list" :key="index" @click="applyDetail(item.ID)">
        <div class="contentListTop">
          <p class="firstLine">
            <span class="status" :class="{red:item.SateID==1,yellow:item.SateID==2,grey:item.SateID==3}">{{item.SateName}}</span>
            <span>申诉日期：{{item.CreateDate}}</span>
          </p>
          <p class="twoLine twoLineInfo">
            <span>{{item.CompanyName}}</span>
            <span @click.stop="noAllow(true,item.ID)" v-if="showBtn">不通过</span>
            <span @click.stop="isAllow(true,item.ID)" v-if="showBtn">审批通过</span>
          </p>
          <i></i>
        </div>
        <div class="contentListBottom">
          <span>业务员{{item.UserName}}</span>
          <span class="lookDetail">查看申诉详情>></span>
        </div>
      </div>

      <div id="mask" v-if="isShowMask">
        <div class="maskContain">
          <p class="title">审批不通过原因</p>
          <div class="textarea">
            <textarea name="" id="" cols="30" rows="6" v-model="giveUpReason"></textarea>
          </div>
          <div class="btn">
            <span class="cancel" @click="noAllow(false)">取消</span>
            <span class="confirm" @click.stop="isAllow(false)">确认</span>
          </div>
        </div>
    </div>
    </div>
</template>
  

<script>
import qs from 'qs'
import axios from "axios";
export default {
  props:['list','AccessId'],
  data(){
    return{
      words:"查看全部",
      maxHeight:1,
      showBtn:true,
      isShowMask:false,
      giveUpReason:'',
      Id:''
    }
  },
  created(){
    if (this.AccessId==4) {
      this.showBtn = false
    }
  },
  methods:{
    isAllow(bool,id) {
      if (bool) {
        axios({
          url: this.getHost() + '/Approval/AgreeSate',
          method: 'post',
          data: qs.stringify({
            UserId: getCookie('UserId'),
            token: getCookie('token'),
            Id: id,
          })
        })
        .then(res => {
          console.log(res)
          if (res.data.Status === 1) {
            this.getToast("操作成功", 'warn')
            this.$emit('refresh')
            this.$emit('refreshNaav')
          } else if (res.data.Status < 0) {
            this.getToast("登录失效，请重新登录", 'warn')
            setTimeout(() => {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            }, 2000);
          } else {
            this.getToast(res.data.Message, 'warn')
          }
        })
      }else{
        if (!this.giveUpReason) {
          this.getToast("请输入不通过的原因",'warn')
          return
        }
        axios({
          url:this.getHost() + '/Approval/CancelSate',
          method: 'post',
          data: qs.stringify({
            UserId: getCookie('UserId'),
            token: getCookie('token'),
            Id: this.Id,
            Reason:this.giveUpReason
          })
        })
        .then(res => {
          console.log(res)
          if (res.data.Status === 1) {
            this.getToast("操作成功", 'warn')
            this.noAllow(false)
            this.$emit('refresh')
            this.$emit('refreshNaav')
            this.giveUpReason = ""
          } else if (res.data.Status < 0) {
            this.getToast("登录失效，请重新登录", 'warn')
            setTimeout(() => {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            }, 2000);
          } else {
            this.getToast(res.data.Message, 'warn')
          }
        })
      }
        
      },
      applyDetail(id) {
        this.$router.push({
          path: '/appealDetails',
          query: {
            id: id
          }
        })
      },
       noAllow(bool,id){
          this.isShowMask = bool
          console.log(bool);
          
          if (bool) {
            this.Id = id
          }
      },
  }
}
</script>
<style scoped>
@import '../common/focusList.css';
@import '../common/mask.css';
/* 最新申诉 */
.firstLine .status{
  background-color: #fff !important;
}
.twoLine.twoLineInfo span:nth-child(1){
  font-size: 16px;
}
.twoLine.twoLineInfo span:nth-child(2){
  background-color: #ccc;
  margin: 0 5px;
}
.lookDetail{
  text-align: right;
}
.red{
  border:1px solid #F26F53;
  color: #F26F53
}
.yellow{
  border:1px solid #BB9F61;
  color: #BB9F61;
}
.grey{
  border:1px solid #BFBFBF;
  color:  #BFBFBF;
}
</style>


