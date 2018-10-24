<template>
    <div>
      <div class="contentList" v-for="(item,index) in list" :key="index" @click="jump(item.ID)">
        <div class="contentListTop">
          <p class="firstLine">
            <span :class="{red:item.Status==2,yellow:item.Status==1,grey:item.Status==3}">{{item.StatusName}}</span>
            <span v-if="item.Status!=3">剩余保护期:{{item.EndDate}}天</span>
          </p>
          <p class="twoLine">
            <span>{{item.Name}}</span>
            <span @click.stop="action(item.ID,'home')" v-if="Action">+行动</span>
          </p>
          <i v-if="item.IsEmphasis||IsEmphasis"></i>
        </div>
        <div class="contentListBottom">
          <span v-if="!item.CreateDate==''">{{item.CreateDate}}</span>
          <span v-if="!item.CreateDate==''">{{item.Content}}</span>
          <span v-if="!item.CreateDate==''">{{item.UserName}}</span>
          <span v-if="item.CreateDate==''">暂无跟单信息</span>
        </div>
      </div>
    </div> 
</template>
  

<script>
export default {
  props:["list","Action","IsEmphasis"],
  data(){
    return{
      emptyInfo:false
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
.red{
  background-color: #FBC1B4;
  color: #F26F53
}
.yellow{
  background-color: #F6EAD4;
  color: #BB9F61;
}
.grey{
  background-color: #ccc;
  color: #fff
}
</style>


