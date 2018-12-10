<template>
<!-- 新建家装公司 -->
  <div id="addCompany">
   <div class="companyInfo">
     <div class="input" @click="showPicker">
       <span>公司类型<i>*</i></span>
       <input type="text" placeholder="请选择" readonly v-model="JobInfo" :job="jobId">
       <i class="arrow"></i>
     </div>
     <div class="input" @click="showAscType">
      <span>归属类型<i>*</i></span>
      <input type="text" placeholder="请选择" readonly v-model="ascription" :asc="ascId">
      <i class="arrow"></i>
    </div>
     <div class="input">
       <span>家装公司全称<i>*</i></span>
       <input type="text" placeholder="请输入家装公司全称" v-model="companyName">
      
     </div>
      <!-- <router-link to="/completeInformation"id="button">下一步</router-link> -->
      <a href="javascript:;" id="button" @click="VerifyCompany">下一步</a>
   </div>
   
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex';
const dataTpye=[
        {
          text:'家装',
          value:1,

        },
        {
          text:'门店',
          value:2,

        }
      ]
export default {
  name: 'addCompany',
  data(){
    return {
      JobInfo:'',
      jobId:0,
      companyName:'',
      ascription:'',
      ascId:0,
    }
  },
  computed: {
    ...mapGetters([
      'AccessId',
      'BusninessCompanyInfo'
    ])
  },
  mounted () {
    this.getPickerConfig()
    this.ascType()
    localStorage.removeItem("companyStyle")
    localStorage.removeItem("companyName")
    this.setBusninessCompanyInfo([])
  },
  methods:{
    //公司分类Picker
    getPickerConfig() {
      axios({
        url:this.getHost()+'/Notice/CompanyList', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token')
        })
      })
      .then(res=>{
        if (res.data.Status===1) {
          this.initPicker(res.data.Data.list)
        }else if (res.data.Status<0) {
          this.getToast(res.data.Message,'warn')
          // this.delCookie("UserId")
          // this.delCookie("token")
          // this.setAccessId('')
          // location.replace('/')
        }
        else{
          this.getToast(res.data.Message,'warn')
        }
      })
      
    },
    //配置分类picker
    initPicker(data){
      this.picker = this.$createPicker({
        title: '公司分类',
        alias: {
          value: 'ID',
          text: 'Name'
        },
        data: [data],
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.LastInfo = ""
          this.JobInfo = selectedText
          this.jobId = selectedVal[0]
          console.log(this.jobId);
          
        },
        onCancel: () => {
          this.getToast("取消选择",'correct')
        }
      })
    },
    //显示分类picker
    showPicker () {
      this.picker.show()
    },
    // 归属类型
    showAscType () {
      this.pickerType.show()
    },
    ascType(){
      this.pickerType = this.$createPicker({
        title: '归属类型',
        data: [dataTpye],
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.LastInfo = ""
          this.ascription = selectedText
          this.ascId = selectedVal[0]
          console.log(this.ascId);
          
        },
        onCancel: () => {
          this.getToast("取消选择",'correct')
        }
      })
    },
    //检查公司
    VerifyCompany(){
      if (!this.jobId) {
        this.getToast("请选择公司类型",'warn')
        return
      }else if (!this.ascId) {
        this.getToast("请输入归属类型",'warn')
        return
      }else if (!this.companyName) {
        this.getToast("请输入公司全称",'warn')
        return
      }
      console.log(this.jobId);
      this.axiosloading()
      axios({
        url:this.getHost()+'/Company/VerifyCompany', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          CategoryID:this.jobId,
          Name:this.companyName
        })
      })
      .then(res=>{
        if (res.data.Status===1) {
           if (res.data.Data.Code==1) {
            //公司不存在 去完善公司信息
            localStorage.setItem("companyStyle",this.jobId)
            localStorage.setItem("companyName",this.companyName)
            localStorage.setItem("typeID",this.ascId)
            this.$router.push({path:"/completeInformation"})
          }
          if (res.data.Data.Code==0) {
            localStorage.setItem("companyStyle",this.jobId)
            localStorage.setItem("companyName",this.companyName)
            this.$router.push({
              path:"/completeInformation",
                query:{
                  id:res.data.Data.ID
                }
              })
          }
          //其他情况
          if (this.AccessId==-1) {
            if (res.data.Data.Code!=1) {
              this.getToast("公司已存在，新建失败",'warn')
            }
          }else{
            if (res.data.Data.Code==2) {
              //洽谈中，签约中
              
              // console.log(this.BusninessCompanyInfo);
              if (res.data.Data.UserID==getCookie('UserId')) {
                this.getToast("该公司已在您的名下",'warn')
              }else{
                this.setBusninessCompanyInfo(res.data.Data)
                this.$router.push({path:"/giveUpCompany"})
              }
              // sessionStorage.setItem('data2',JSON.stringify(res.data.Data))
              
            }else if (res.data.Data.Code==3) {
              //已签约
              this.setBusninessCompanyInfo(res.data.Data)
              this.$router.push({path:"/giveUpCompany"})

            }else if (res.data.Data.Code==-1) { 
              this.$router.push({
                path:"/companyContract",
                query:{
                  CategoryID:this.jobId,
                  Name:this.companyName
                }
              })
              
              //  this.setBusninessCompanyInfo(res.data.Data)
              //code=0：已删除，已新建，Code=-1：已放弃
            }
          }
        }else if (res.data.Status<0) {
          this.delCookie("UserId")
          this.delCookie("token")
          this.setAccessId('')
          location.replace('/')
        }
        else{
          this.getToast(res.data.Message,'warn')
        }
      })
    },
    ...mapMutations({
      setAccessId: 'SET_ACCESSID',
      setBusninessCompanyInfo:'SET_BUSNINESSCOMPANYINFO'
    })
  }
  
}
</script>

<style scoped>
@import '../../common/input.css';
#addCompany{
  padding-top: 10px;
  box-sizing: border-box;
  height: 100vh;
}
.companyInfo{
  background-color: #fff;
  height: 100%;
  position: relative;
}
#button{
  width: calc( 100% - 80px);
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%)
}
</style>
