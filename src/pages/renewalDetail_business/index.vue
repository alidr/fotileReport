<template>
  <div id="renewalDetailCon">
    <div class="title">
      <span></span>最新申请
    </div>
    <div id="newApply">
      <div class="applyStatusList">
        <div class="statusListItem" v-for="(item,index) in newContract.recordlist" :key="index">
          <p class="time">{{item.Date}}</p>
          <div class="itemInfo">
            <span class="job_name">{{item.JobName}} {{item.UserName}}</span>
            <span class="status" :class="{yellow:item.Status!=-1,red:item.Status==-1}">{{item.Status==-1? '审批不通过': item.Content}}</span>
          </div>
          <div class="reason" v-if="item.Status==-1">原因：{{item.Content}}</div>
        </div>
      </div>
    </div>
    <div class="applyerInfo">
      <div class="flex justify">
        <span>家装公司</span>
        <span>{{newContract.CompanyName}}</span>
      </div>
      <div class="flex justify">
        <span>申请人</span>
        <span>{{newContract.UserName}}</span>
      </div>
    </div>
    <div class="title grey">
      <span></span>新合同政策费用
    </div>
    <div class="newContractFee">
      <div class="contractItem flex">
        <span class="lable">合作时间</span>
        <span>{{newContract.model.CoopStartDate}}至{{newContract.model.CoopEndDate}}</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">全年预估销额</span>
        <span>{{newContract.model.SalePrice}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">进场费</span>
        <span>{{newContract.model.DoorMoney}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">活动费</span>
        <span>{{newContract.model.ActivityFee}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">固定费用</span>
        <span>{{newContract.model.FixedFee}}元</span>
      </div>
      <div class="contractItem flex direction">
        <span class="lable">固定费用说明</span>
        <p>{{newContract.model.FixedContent}}</p>
      </div>
      <div class="contractItem flex">
        <span class="lable">扣点形式</span>
        <span>卖价倒扣了{{newContract.model.BucklePoint}}个点</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">激励性返利</span>
        <span v-if="newContract.model.IsRebate">有</span>
        <span v-if="!newContract.model.IsRebate">否</span>
      </div>
      <ul class="itemList" v-if="newContract.model.IsRebate">
        <li class="flex justify-end" v-for="(item,index) in newContract.model.list" :key="index">年销售{{item.SalePrice}}万，返利{{item.BucklePoint}}个点</li>
      </ul>
      <div class="contractItem flex direction">
        <span>补充说明</span>
        <p>{{newContract.model.Remark}}</p>
      </div>
    </div>
    <div class="title grey">
      <span></span>历史合同政策费用
    </div>
    <div class="newContractFee">
      <div class="contractItem flex leiji">
        <span>今年累计销额</span>
        <span>{{newContract.newauth.CompanySalePrice}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">合作时间</span>
        <span>{{newContract.newauth.CoopStartDate}}至{{newContract.newauth.CoopEndDate}}</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">全年预估销额</span>
        <span>{{newContract.newauth.SalePrice}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">进场费</span>
        <span>{{newContract.newauth.DoorMoney}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">活动费</span>
        <span>{{newContract.newauth.ActivityFee}}元</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">固定费用</span>
        <span>{{newContract.newauth.FixedFee}}元</span>
      </div>
      <div class="contractItem flex direction">
        <span class="lable">固定费用说明</span>
        <p>{{newContract.newauth.FixedContent}}</p>
      </div>
      <div class="contractItem flex">
        <span class="lable">扣点形式</span>
        <span>卖价倒扣了{{newContract.newauth.BucklePoint}}个点</span>
      </div>
      <div class="contractItem flex">
        <span class="lable">激励性返利</span>
        <span v-if="newContract.newauth.IsRebate">有</span>
        <span v-if="!newContract.newauth.IsRebate">否</span>
      </div>
      <ul class="itemList" v-if="newContract.newauth.IsRebate">
        <li class="flex justify-end" v-for="(item,index) in newContract.newauth.list" :key="index">年销售{{item.SalePrice}}万，返利{{item.BucklePoint}}个点</li>
      </ul>
    </div>
    <div class="historyApply" v-if="newContract.historylist">
      <p class="split"></p>
      <div class="hisList" v-for="(item,index) in newContract.historylist" :key='index'>
        <div class="title">
          <span></span>历史申请 ({{index + 1}})
        </div>
        <div id="newApply">
        <div class="applyStatusList">
          <div class="statusListItem" v-for="(program,index) in item.recordlist" :key="index">
            <p class="time">{{program.Date}}</p>
            <div class="itemInfo">
              <span class="job_name">{{program.JobName}} {{program.UserName}}</span>
              <span class="status" :class="{yellow:program.Status!=-1,red:program.Status==-1}">{{program.Status==-1? '审批不通过': program.Content}}</span>
            </div>
            <div class="reason" v-if="program.Status==-1">原因：{{program.Content}}</div>
          </div>
        </div>
        </div>
      <div class="newContractFee">
        <div class="contractItem flex">
          <span class="lable">合作时间</span>
          <span>{{item.CoopStartDate}}至{{item.CoopEndDate}}</span>
        </div>
        <div class="contractItem flex">
          <span class="lable">全年预估销额</span>
          <span>{{item.SalePrice}}元</span>
        </div>
        <div class="contractItem flex">
          <span class="lable">进场费</span>
          <span>{{item.DoorMoney}}元</span>
        </div>
        <div class="contractItem flex">
          <span class="lable">活动费</span>
          <span>{{item.ActivityFee}}元</span>
        </div>
        <div class="contractItem flex">
          <span class="lable">固定费用</span>
          <span>{{item.FixedFee}}元</span>
        </div>
        <div class="contractItem flex direction">
          <span class="lable">固定费用说明</span>
          <p>{{item.FixedContent}}</p>
        </div>
        <div class="contractItem flex">
          <span class="lable">扣点形式</span>
          <span>卖价倒扣了{{item.BucklePoint}}个点</span>
        </div>
        <div class="contractItem flex">
          <span class="lable">激励性返利</span>
          <span v-if="item.IsRebate">有</span>
          <span v-if="!item.IsRebate">否</span>
        </div>
        <ul class="itemList" v-if="item.IsRebate">
          <li class="flex justify-end" v-for="(it,index) in item.list" :key="index">年销售{{it.SalePrice}}万，返利{{it.BucklePoint}}个点</li>
        </ul>
        <div class="contractItem flex direction">
          <span>补充说明</span>
          <p>{{item.Remark}}</p>
        </div>
      </div>
      </div>
      <div class="white">
        <a href="javascript:;" id="button" @click="linkApply" v-if="AccessId==5&&newContract.model.Status== -1">重新申请</a>
      </div>
    </div>
    
  </div>
</template>
<script>
import qs from 'qs';
import axios from "axios";
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      newContract:{},
      reId:'',
      ID:''
    }
  },
  created() {
    sessionStorage.removeItem('_info')
    this.reId = this.$route.query.reId
    this.ID = this.$route.query.companyId
    this.getInfo()
  },
  computed: {
    ...mapGetters([
      'AccessId'
    ])
  },
  methods:{
    linkApply() {
      const _info = {
            '_companyName':this.newContract.CompanyName,
            '_UName':this.newContract.UserName,
            '_companyId': this.ID
          }
      sessionStorage.setItem('_info',JSON.stringify(_info))
      this.$router.push({path:'/applyRenewal',query:{
        companyId:this.ID
      }})
    },
    getInfo() {
      this.axiosloading()
      axios({
          url: this.getHost() + '/Company/RenewApplyDetailById',
          method: 'post',
          data: qs.stringify({
            UserId: getCookie('UserId'),
            token: getCookie('token'),
            Id: this.reId
          })
        })
        .then(res => {
          if (res.data.Status === 1) {
            this.newContract = res.data.Data
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
  }
}
</script>
<style lang="stylus" scoped>
@import './index.stylus'

</style>


