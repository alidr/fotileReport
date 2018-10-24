<template>
  <!-- 审批记录  -->
  <div id="ApprovalRecord">
    <div class="approvalModel" v-if="OneList.length">
      <p class="title">授权申请记录</p>
      <!-- <div class="approvalInfo">
        <p class="time"><span>2018-08-11 12:00</span></p>
        <p class="info">业务员 小白啊 
          <span>提交授权申请</span>
        </p>
      </div> -->
       <div class="approvalInfo" v-for="(item,index) in OneList" :key="index">
        <p class="time"><span>{{item.Date}}</span></p>
        <p class="info">{{item.JobName}} {{item.UserName}}
          <span  v-if="item.Status!=-1">{{item.Content}}</span>
          <span :class="{color:item.Status==-1}" v-if="item.Status==-1">审批不通过</span>
        </p>
      <p class="reson" v-if="item.Status==-1">{{item.Content}}</p>
      </div>
    </div>
    <div class="approvalModel" v-if="TwoList.length">
      <p class="title">合同报备申请记录</p>
      <!-- <div class="approvalInfo">
        <p class="time"><span>2018-08-11 12:00</span></p>
        <p class="info">业务员 小白啊 <span>提交授权申请</span></p>
      </div> -->
       <div class="approvalInfo" v-for="(item,index) in TwoList" :key="index">
        <p class="time"><span>{{item.Date}}</span></p>
        <p class="info">{{item.JobName}} {{item.UserName}}
          <span  v-if="item.Status!=-1">{{item.Content}}</span>
          <span :class="{color:item.Status==-1}" v-if="item.Status==-1">审批不通过</span>
        </p>
      <p class="reson" v-if="item.Status==-1">{{item.Content}}</p>
      </div>
    </div>
    <empty v-if="infoNull"></empty>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import empty from '../../components/empty'

export default {
  name: 'ApprovalRecord',
  data(){
    return{
      OneList:[],
      TwoList:[],
      queryId:'',
      infoNull:false
    }
  },
  created(){
    this.queryId=localStorage.getItem("companyId")
    console.log(this.queryId);
    
    this.getOneList(1),
    this.getOneList(2)
  },
  components:{
    empty
  },
  methods:{
    getOneList(num){
      axios({
        url:this.getHost()+'/Approval/GetApprovalList', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          CompanyID:this.queryId,
          TypeID:num
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          if (num==1) {
            this.OneList = res.data.Data.list
          }else{
            this.TwoList = res.data.Data.list
          }
          if (this.OneList.length==0&&this.TwoList.length==0) {
            this.infoNull = true
          }else{
            this.infoNull = false
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
    
  }
}
</script>

<style scoped>
#ApprovalRecord{
  padding-top: 10px;
}
.approvalModel .title{
  background-color: #fff;
  padding-left: 10px;
  box-sizing: border-box;
  height: 50px;
  display: flex;
  align-items: center;
  font-weight: 600;
}
.approvalInfo:last-child{
  margin-bottom: 10px;
}
.approvalInfo{
  margin: 10px 10px 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 4px;
}
.approvalInfo .time{
  border-bottom: 1px  solid #f0f0f0;
  padding-bottom: 10px;
}
.approvalInfo .time span{
  background-color: #ccc;
  color: #fff;
  border-radius: 4px;
  padding: 2px 5px;
  font-size: 12px;
}
.approvalInfo .info{
  margin-top: 10px;
}
.approvalInfo .info span{
  color: #E2C78F;
  margin-left: 10px;
}

.approvalInfo .info .color{
  color: #F26F53;
}
.reson{
  margin-top: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
