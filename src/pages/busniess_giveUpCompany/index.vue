<template>
  <div class="giveUpCompany">
    <div class="top" v-if="data1.Code==3">
      <img src="./images/222_03.png" alt="">
      <p>很遗憾，{{data1.CompanyName}}已签约</p>
    </div>
    <div class="top" v-if="data2.Code==2">
      <img src="./images/222_03.png" alt="">
      <p>{{data2.CompanyName}}正在{{data2.StatusName}}</p>
    </div>
    <div class="content" v-if="data2.Code==2">
      <ul>
        <li>
          <p>经销商：{{data2.DealerName}}</p>
        </li>
        <li>
          <p>业务员：{{data2.UserName}}</p>
        </li>
        <li>
          <p>当前已申请等待人数：{{data2.WaitCount}}人</p>
        </li>
      </ul>
    </div>
     <div class="content" v-if="data1.Code==3">
      <ul>
        <li>
          <p>经销商：{{data1.DealerName}}</p>
        </li>
        <li>
          <p>业务员：{{data1.UserName}}</p>
        </li>
      </ul>
    </div>
    <div class="btn">
      <button type="button" class="sure" @click="giveUp" v-if="data2.Code==2">放弃，返回首页</button>
      <button type="button" class="sure" @click="applyWait" v-if="data2.Code==2">申请等待</button>
      <button type="button" class="sure" @click="appeal" v-if="data2.Code==2">我要申诉</button>
      <button type="button" class="sure" @click="giveUp" v-if="data1.Code==3">返回首页</button>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'giveUpCompany',
    data(){
      return{
        //洽谈中
        data2:{
          Code:'',
          CompanyName:'',
          DealerName:'',
          UserName:'',
          WaitCount:'',
          StatusName:''
        },
        data1:{
          Code:'',
          CompanyName:'',
          DealerName:'',
          UserName:'',
        }
      }
    },
    computed: {
    ...mapGetters([
      'BusninessCompanyInfo'
      ])
    },
    created(){
      console.log(222222222222222);
      
      console.log(this.BusninessCompanyInfo);
      
      if (this.BusninessCompanyInfo.Code==2) {
        this.data2 = this.BusninessCompanyInfo
        console.log(this.data2);
      }else{
        this.data1 = this.BusninessCompanyInfo
        
      }
    },
    methods:{
      giveUp(){
        this.$router.push({
          path:'/home'
        })
      },
      applyWait(){
        axios({
          url:this.getHost()+'/Approval/CompanyWaitSave', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            id:this.data2.ID
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.getToast("申请成功",'warn')
            setTimeout(() => {
              this.$router.push({
                path:'/home',
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
      },
      appeal(){
        sessionStorage.setItem("ID",this.data2.ID)
        this.$router.push({
          path:'/appealMaterial',
          query:{
            applyType:1
          }
        })
      }
    }
  }

</script>

<style scoped>
  .giveUpCompany {
    width: 100%;
    overflow: hidden;
  }

  .top {
    width: 100%;
    background: #fff5e7;
    padding: 12px 22px;
    margin-bottom: 16px;
    box-shadow: 0px 6px 10px #f2eee7;
    
    

  }

  .top img {
    float: left;
    display: block;
    width: 22px;
    height: 22px;
    margin-right: 14px;
  }

  .top p {
    font-size: 14px;
    color: #f07058;
    line-height: 22px;
  }

  .content {
    width: 92%;
    margin: 0 auto;
    background: white;
    border-radius: 4px;

  }
.content ul li{
    width: 92%;
    margin: 0 auto;
    border-top: 1px solid #f0f0f0;
}
.content ul li p{
    font-size: 14px;
    color: #666666;
    line-height: 44px;
}
.content ul li:nth-child(1){
    border:none;
}
.btn{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20vh;
}
.btn .sure:nth-child(1){
  background-image: linear-gradient(#D4D4D4);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
}
.btn .sure:nth-child(2){
  background-image: linear-gradient(#fff);
  border: #D5AE61 1px solid;
  color: #D5AE61;
}

.sure {
  width: 80%;
  height: 40px;
  border-radius: 20px;
  background: #d4d4d4;
  font-size: 14px;
  color: white;
  text-align: center;
  line-height: 40px;
  background: linear-gradient(left, #E2C78F, #D5AE61);
  box-shadow: 0px 6px 10px rgba(223, 174, 72, 0.2);
  margin-bottom: 15px;
}

</style>
