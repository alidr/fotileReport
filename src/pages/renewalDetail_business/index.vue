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
    <div class="historyApply">
      <p class="split"></p>
      <div class="hisList" v-for="(item,index) in 2" :key='index'>
        <div class="title">
          <span></span>历史申请 ({{index + 1}})
        </div>
        <div id="newApply">
        <div class="applyStatusList">
          <div class="statusListItem" v-for="(item,index) in 2" :key="index">
            <p class="time">2018-05-11  12:00</p>
            <div class="itemInfo">
              <span class="job_name">业务员XXX</span>
              <span class="status" :class="{yellow:index==0,red:index==1}">提交续签申请...</span>
            </div>
            <div class="reason" v-if="index==1">原因：XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
          </div>
        </div>
      </div>
        <div class="newContractFee">
          <div class="contractItem flex">
            <span class="lable">合作时间</span>
            <span>2018-10-23至2019-10-23</span>
          </div>
          <div class="contractItem flex">
            <span class="lable">全年预估销额</span>
            <span>2018-10-20元</span>
          </div>
          <div class="contractItem flex">
            <span class="lable">进场费</span>
            <span>2018-10-23至2019-10-23</span>
          </div>
          <div class="contractItem flex">
            <span class="lable">活动费</span>
            <span>2018-10-23至2019-10-23</span>
          </div>
          <div class="contractItem flex">
            <span class="lable">固定费用</span>
            <span>2018-10-23至2019-10-23</span>
          </div>
          <div class="contractItem flex direction">
            <span class="lable">固定费用说明</span>
            <p>费用1类型  2100元，费用2类型2899元。</p>
          </div>
          <div class="contractItem flex">
            <span class="lable">扣点形式</span>
            <span>卖价倒扣了4个点</span>
          </div>
          <div class="contractItem flex">
            <span class="lable">激励性返利</span>
            <span>有</span>
          </div>
          <ul class="itemList">
            <li class="flex justify-end" v-for="(item,index) in 3" :key="index">年销售344万，返利3个点</li>
          </ul>
          <div class="contractItem flex direction">
            <span>补充说明</span>
            <p>费用1类型  2100元，费用2类型2899元。</p>
          </div>
        </div>
      </div>
      <div class="white">
        <a href="javascript:;" id="button" @click="linkApply">重新申请</a>
      </div>
    </div>
    
  </div>
</template>
<script>
import qs from 'qs';
import axios from "axios";
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


