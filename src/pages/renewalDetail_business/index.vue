<template>
  <div id="renewalDetailCon">
    <div class="title">
      <span></span>最新申请
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
    <div class="applyerInfo">
      <div class="flex justify">
        <span>家装公司</span>
        <span>XXXXXXXX公司</span>
      </div>
      <div class="flex justify">
        <span>申请人</span>
        <span>当前业务员</span>
      </div>
    </div>
    <div class="title grey">
      <span></span>新合同政策费用
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
    </div>
    <div class="title grey">
      <span></span>历史合同政策费用
    </div>
    <div class="newContractFee">
      <div class="contractItem flex leiji">
        <span>今年累计销额</span>
        <span>xxxxxxxxxx元</span>
      </div>
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
        </div>
      </div>
      <div class="white">
        <router-link to="javascript:;" id="button">重新申请</router-link>
      </div>
    </div>
    
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="stylus" scoped>
@import './index.stylus'

</style>


