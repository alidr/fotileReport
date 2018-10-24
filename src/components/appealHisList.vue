<template>
  <div class="home_content">
      <div class="contentList" v-for="(item,index) in newHistoryData" :key="index">
        <div class="contentListTop">
          <p class="firstLine">
            <span class="status">{{item.TypeName}}</span>
            <span>申诉日期:{{item.CreateDate}}</span>
          </p>
          <p class="twoLine">
            <span>{{item.CompanyName}}</span>
            <!-- <span>撤销申诉</span> -->
          </p>
        </div>
        <!-- <div class="contentListBottom">
          <span>待审批／审批中不可撤销</span>
        </div> -->
        <div class="contentListBottom">
          <p>
            <span>{{item.ResultDate}}</span>
            <span class="appealStatus" v-if="item.Status == 0">申诉失败</span>
            <span class="appealStatus" v-if="item.Status == 1">申诉成功</span>
          </p>
          <p>原因:&emsp;公司状态更新为“已签约”，请保持继续跟进。</p>
        </div>
      </div>
      <!-- <div class="lookMore">
        <a href="javascript:;">查看全部</a>
      </div> -->
    </div>
</template>
<script>
export default {
  props: ["historyData"],
   data()
   {
    return{
      // msgList:[1,1,1,1,1],
      newHistoryData: ''
      
    }
    
  },
   mounted () {
    this.newHistoryData = this.historyData;
  },
}
</script>
<style scoped>
@import '../common/focusList.css';
.contentList{
  padding-left: 20px;
}
.contentListTop,
.contentListBottom{
  margin-left: 0;
}
.contentListBottom{
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.contentListBottom p{
  display: flex;
}
.contentListBottom p>span,
.contentListBottom .appealStatus{
  width: auto !important;
  flex-grow: 1;
}
.contentListBottom .appealStatus{
  font-weight: 600;
  font-size: 14px;
}
.home_content{
  padding-top: 10px;
}
.firstLine .status{
  background-color: #fff !important;
  border:1px solid #BB9F61;
  color: #BB9F61;
  margin-left: 5px !important;
}
</style>

