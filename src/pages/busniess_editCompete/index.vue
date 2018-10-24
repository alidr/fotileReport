<template>
<!-- 编辑竞品信息 -->
  <div id="EditCompete">
    <div class="input title">
       <span>{{month}}月竞品数据</span>
     </div>
     <div class="input">
       <span>竞品销量</span>
       <input type="text" placeholder="请输入竞品销量" v-model="SaleCount">
       个
     </div>
     <div class="input">
       <span>竞品开工数</span>
       <input type="text" placeholder="请输入竞品开工数" v-model="WorkCount">
       个
     </div>
     <div class="input">
       <span>竞品出样量</span>
       <input type="text" placeholder="请输入竞品出样量" v-model="SampleCount">
       个
     </div>
     <div class="input">
       <span>门店数量</span>
       <input type="text" placeholder="请输入门店数量" v-model="ShopCount">
       个
     </div>
     <div class="input">
       <span>设计师数量</span>
       <input type="text" placeholder="请输入设计师数量" v-model="StylistCount">
       个
     </div>
     <a href="javascript:;" id="button" @click="commit">保存</a>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
export default {
  name: 'EditCompete',
  data(){
    return{
      month:'',
      ID:'',
      year:'',
      SaleCount:'',
      WorkCount:'',
      SampleCount:'',
      ShopCount:'',
      StylistCount:'',
    }
  },
  created(){
    this.month = this.$route.query.month
    this.ID = this.$route.query.id
    this.year = this.$route.query.year||''
  },
  methods:{
    commit(){
      if (!this.SaleCount) {
        this.getToast("请输入竞品销量",'warn')
        return
      }else if (!this.WorkCount) {
        this.getToast("请输入竞品开工数",'warn')
        return
      }else if (!this.SampleCount) {
        this.getToast("请输入竞品出样量",'warn')
        return
      }else if (!this.ShopCount) {
        this.getToast("请输入门店数量",'warn')
        return
      }else if (!this.StylistCount) {
        this.getToast("请输入设计师数量",'warn')
        return
      }
      axios({
        url:this.getHost()+'/Company/CompanyAnalyzeSave', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Month:this.month,
          CompanyID:this.ID,
          Year:this.year,
          SaleCount:this.SaleCount,
          WorkCount:this.WorkCount,
          SampleCount:this.SampleCount,
          ShopCount:this.ShopCount,
          StylistCount:this.StylistCount,
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("编辑成功，返回公司详情页",'correct')
          setTimeout(() => {
            this.$router.push({
              path:'/companyDetail',
              query:{
                id:this.ID
              }
            })
          }, 2000);
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
    }
  }
}
</script>

<style scoped>
@import '../../common/input.css';
#EditCompete{
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  overflow: hidden;
}
.input{
 padding-right: 10px;
 box-sizing: border-box;
}
.title{
  font-weight: 600;
}
input{
  margin: 0 !important;
}
#button{
  width: calc(100% - 80px);
  margin:40vh auto;
}
</style>
