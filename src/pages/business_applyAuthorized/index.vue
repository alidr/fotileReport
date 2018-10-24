<template>
  <!-- 申请授权 -->
  <div id="applyAuthorized"> 
    <div class="apply">
      <div class="input" @click="showDatePicker">
         <span>合作时间<i>*</i></span>
         <input type="text" placeholder="请选择" readonly v-model="date">
         <i class="arrow" v-if="lookStyle==1"></i>
       </div>
       <div class="input">
         <span>固定费用<i>*</i></span>
         <input type="text" placeholder="请输入固定费用" v-model="price" :readonly="lookStyle==2">
       </div>
       <div class="input">
         <span>扣点<i>*</i></span>
         <input type="text" placeholder="请输入扣点" v-model="discount" :readonly="lookStyle==2">
       </div>
       <div class="input">
         <span>激励性返利<i>*</i></span>
         <input type="text" placeholder="请输入激励性返利" v-model="Rebate"
         :readonly="lookStyle==2">
       </div>
    </div>
    <a href="javascript:;" id="button" @click="commit" v-if="lookStyle==1">确认提交</a>
  </div> 
</template>
<script>
import qs from 'qs'
import axios from "axios";
export default {
  name:"ApplyAuthorized",
  data(){
    return{
      date:'',
      price:'',
      discount:'',
      Rebate:'',
      ID:'',
      lookStyle:''

    }
  },
  created(){
    this.ID = this.$route.query.id
    // console.log(this.ID);
    
    this.lookStyle = this.$route.query.lookStyle
    if (this.lookStyle==2) {
      this.gitInfo()
    }
  },
  methods:{
    gitInfo(){
      this.axiosloading()
      axios({
        url:this.getHost()+'/Company/ApplyAuth', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Id:this.ID
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.date = res.data.Data.CoopDate
          this.price = res.data.Data.FixedCharge
          this.discount = res.data.Data.BucklePoint
          this.Rebate = res.data.Data.Rebate
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
     showDatePicker() {
       if (this.lookStyle==1) {
         if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '选择日期',
          min: new Date(2010, 1, 1),
          max: new Date(2020, 12, 31),
          value: new Date(),
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
          })
        }
        this.datePicker.show()
       }
    },
    selectHandle(date, selectedVal, selectedText) {
      this.date = this.formatDate(date)
    },
    cancelHandle() {
      this.getToast("取消选择",'warn')
    },
    formatDate(date){  
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d;  
    } ,
    //提交
    commit(){
      if (!this.date) {
        this.getToast("请选择合作时间",'warn')
      }else if (!this.price) {
        this.getToast("请输入固定费用",'warn')
      }else if (!this.discount) {
        this.getToast("请输入扣点",'warn')
      }else if (!this.Rebate) {
        this.getToast("请输入激励性返利",'warn')
      }else{
        this.axiosloading()
        axios({
        url:this.getHost()+'/Company/ApplyAuthSave', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          CompanyID:this.ID,
          CoopDate:this.date,
          FixedCharge:this.price,
          BucklePoint:this.discount,
          Rebate:this.Rebate
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("提交成功",'correct')
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
  
}
</script>
<style scoped>
@import '../../common/input.css';
#applyAuthorized{
  padding-top: 10px;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.apply{
  height: 100vh;
  padding:0 10px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 10px;
}
.apply input{
  margin:0 0 0 10px;
}
.apply span,.apply .arrow{
  margin: 0;
}
#button{
  width: calc(100% - 60px);
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%)
}

</style>


