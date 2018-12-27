<template>
    <div>
      <div class="contentList" v-for="(item,index) in list" :key="index" @click="jump(item.ID)">
          <div class="contentListTop">
              <p class="firstLine">
                <span :class="{qiaTan:item.Status==1,qianYue:item.Status==2,qianYued:item.Status==3,fangQi:item.Status==-1,xinJian:item.Status==0,guoQi:item.Status==-3}">{{item.StatusName}}</span>
                <span v-if="item.Status!=3">剩余保护期:{{item.EndDate}}天</span>
                <span v-if="item.Status==3">合同剩余时间:{{item.EndTime}}天</span>
              </p>
              <p class="twoLine">
                <a href="javascript:;" class="round" :class="{'active':checkBoxs[index]}" @click.stop="check(index,item.ID)"><b
                    :class="{'active':checkBoxs[index]}"></b></a>
                    <!-- 公司评级 -->
                    <!-- <a href="javascript:;"  class="bigIcon"><span class="smallIcon"><b>B+</b></span></a> -->
                <a href="javascript:;" class="name">{{item.Name}}</a>
              </p>
              <p class="downLine"><span class="zuZhi">{{item.SalesManName}}</span><b>({{item.Organization}})</b></span><span class="address">{{item.Address}}</span></p>
              <i v-if="item.IsEmphasis||IsEmphasis"></i>
            </div>
            <div class="contentListBottom">
                <i v-if="!item.CreateDate==''">{{item.CreateDate}}</i>
              <p v-if="!item.CreateDate==''">{{item.Content}}</p>
              <b v-if="!item.CreateDate==''">{{item.UserName}}</b>
              <i v-if="item.CreateDate==''">暂无跟单消息</i>
            </div>
      </div>
    </div> 
</template>
  

<script>
export default {
  props:["list","Action","IsEmphasis"],
  data(){
    return{
      emptyInfo:false,
      checkBoxs:[],
    }
  },
  created(){
  },
  methods:{
    jump(num){
      this.$router.push({
          path: '/companyDetail',
          query: {
            id: num
          }
        })
    },
    action(num,jump){
      this.$router.push({
          path: '/action',
          query: {
            id: num,
            jump:jump
          }
        })
    }
  }
}
</script>
<style scoped>
@import '../common/focusList.css';
.contentList{
  padding: 15px 22px 0;
}
.contentListTop {
    margin-left: 0;
}
.contentListBottom{
  margin-left: 0;
}
.contentListBottom span:nth-child(1){
  margin-left: 4px;
}
.contentListBottom span:nth-child(3){
  margin-right: 4px;
}
.firstLine span{
  margin-left: 14px;
}
.downLine{
padding: 0;
}
.contentListTop{
  padding-bottom: 10px
}
.contentListTop i{
  position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    border-radius: 6px 3px;
}
</style>


