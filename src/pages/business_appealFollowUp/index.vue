<template>
<!-- 申诉跟进权 -->
  <div id="AppealFollowUp">
    <div class="followTop">
      <p>经销商：&emsp;{{queryStr.DealerName}}</p>
      <p>业务员:&emsp;{{queryStr.UserName}}</p>
      <p>当前的等待人数:&emsp;<span>{{queryStr.WaitCount}}</span></p>
    </div>
    <div class="followBottom">
      <p>
        <span class="active"><b :class="{active: queryStr.StatusName =='洽谈中'}"></b></span>
        洽谈中
      </p>
      <div class="line" :class="{active: queryStr.StatusName =='签约中'}"></div>
      <p>
        <span><b :class="{active: queryStr.StatusName =='签约中'}"></b></span>
        签约中
      </p>
      <div class="line" :class="{active:queryStr.StatusName =='已签约'}"></div>
      <p>
        <span><b :class="{active:queryStr.StatusName =='已签约'}"></b></span>
        已签约
      </p>
    </div>
    <a href="javascript:;" id="button" @click="goApply">我要申诉</a>
  </div>
</template>

<script>
export default {
  name: 'AppealFollowUp',
  data () {
    return {
      queryStr:{
        CompanyName:'',
        UserName:'', 
        DealerName:'',
        WaitCount:'',  
      }
    }
  },
  created () {
    if (JSON.parse(sessionStorage.getItem("ComInfo"))) {
      this.queryStr =JSON.parse(sessionStorage.getItem("ComInfo"))
    }
    this.id = this.$route.query.id;
  },
  methods : {
    goApply () {
      // this.queryStr.applyType = 1;
      this.$router.push({
        path: '/appealMaterial',
        query:{applyType:1}
      })
    },
  }
}
</script>

<style scoped>
#AppealFollowUp{
  padding:10px;
  box-sizing: border-box;
  height: 100%;
}
.followTop,.followBottom{
  background-color: #fff;
  padding: 0 10px;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.followTop p{
  height: 42px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  color: #666666;
}
.followTop p:last-child{
  border-bottom: none;
}
.followTop p span{
  color: #E2C78F;
}

.followBottom{
  padding: 20px 15px;
}
.followBottom p{
  display: flex;
  align-items: center;
}
.followBottom p span{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  border: 1px solid #ccc;
  margin-right: 15px;
}
.followBottom p span.active{
  border:1px solid #E2C78F;
}
.followBottom p span b{
  display: flex;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #ccc;
}
.followBottom p span b.active{
  background-color: #E2C78F;
}
.line{
  width: 100%;
  height: 32px;
  border-left: 1px dotted #ccc;
  margin-left: 13px;
}
.line.active{
  border-left: 1px dotted #E2C78F;
}

#button{
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 80px);
}
</style>
