<template>
    <div>
      <div class="contentList" v-for="(item,index) in list" :key="index" @click="jump(item.ID)">
        <div class="contentListTop">
          <p class="firstLine">
            <span>{{item.StatusName}}</span>
            <span>剩余保护期:{{item.EndDate}}天</span>
          </p>
          <p class="twoLine">
            <a href="javascript:;" class="round"><b></b></a>
            <a href="javascript:;" class="name">{{item.Name}}</a>
            <!-- <a href="javascript:;" class="btn">+行动</a> -->
          </p>
          <i v-if="item.IsEmphasis||IsEmphasis"></i>
        </div>
        <div class="contentListBottom">
           <span>{{item.CreateDate}}</span>
          <span>{{item.Content}}</span>
          <span>{{item.UserName}}</span>
        </div>
      </div>
    </div> 
</template>
  

<script>
export default {
  props:['list',"IsEmphasis"],
  data(){
    return{
      
    }
  },
  methods:{
    jump(num){
      this.$router.push({
        path: '/companyDetail',
        query: {
          id: num
        }
      })
    }
  }
}
</script>
<style scoped>
@import '../common/focusList.css';
.twoLine .round{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border: 1px solid #ccc;
  margin-right: 15px;
}
.twoLine .round.active{
  border:1px solid #E2C78F;
}
.twoLine .round b{
  display: flex;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #fff;
}
.twoLine .round b.active{
  background-color: #E2C78F;
}
</style>


