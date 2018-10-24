<template>
<!-- 提交跟进资料 -->
  <div id="AppealMaterial" >
    <div class="delayDate" v-if="delay">
      <p class="title">申请延期天数</p>
      <div>
        <input type="text" placeholder="请输入需要延期的天数" v-model="Day">
        <span>天</span>
      </div>
    </div>
    <div class="companyInfo" v-if="special">
       <div class="input">
       <span>公司类型</span>
       <input type="text"  readonly v-model="CategoryName">
       <i class="arrow"></i>
       </div>
       <div class="input">
          <span>公司实际地址</span>
          <input type="text" v-model="Address" readonly>  
       </div>
    </div>
    <div class="AppealReason" v-if="forward">
      <p class="title">请填写申诉原因</p>
      <div>
        <textarea name="" id="" cols="30" rows="6" placeholder="请填写申诉原因(必填)" v-model="applyReason"></textarea>
      </div>
    </div>
    <div class="Material">
      <p class="title" v-if="!special">请上传申诉材料</p>
      <p class="title" v-if="special">相关凭证</p>
      <div class="file">
            <span class="mission_img">
              <span class="mui-icon mui-icon-plusempty file">
                <div class="vue-upload-img-multiple">
                <div v-if="image!=''">
                  <ul>
                    <img class="img" :src="image"  />
                    <a href="javascript:void(0);" >
                      <span id="close" @click='delImage'>X</span>
                    </a>
                  </ul>
                </div>
                <div class="unloadImgCon">
                  <div v-if="!image" class="unloadImg">
                    <input type="file" @change="onFileChange" accept="image/*">
                    <i>+</i>
                  </div>
                </div>
              </div>
            </span>
          </span>
        </div>
    </div>
    <a href="javascript:;"  id="button" @click="submitApply">提交申诉</a>
    <div id="mask" v-if="hasPsdMask">
      <div class="maskContain">
        <p style="margin-bottom:20px">操作成功</p>
       
        <a style="margin-bottom:10px" href="javascript:;" class="cancel" @click="confirm">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import qs from "qs";
import lrz from 'lrz'
export default {
  name: 'AppealMaterial',
  data(){
    return{
      hasPsdMask: false,
      special:false,
      delay:false,
      forward: false,
      forward: {
        reason: '',
      },
      applyType: '',
      url: '',
      applyData: {},
      applyReason: '',
      Day:'',
      image:'',
      CategoryName:'',
      Address:''
    }
  },
  created(){
    
     this.CategoryName = sessionStorage.getItem("CategoryName")
     this.Address = sessionStorage.getItem("Address")
     this.applyType = this.$route.query.applyType;
    switch (this.applyType) {
       case 1 :
       this.forward = true;
       break;
        case 2 :
       this.delay = true;
       break;
        case 3 :
       this.special = true;
       break;
    }
    // if (page === 1) {
    //   // 申请跟进权
    // }else if (page === 2) {
    //   // 申请延长保护期
    //   this.delay = true
    // }else if (page === 3) {
    //   //特殊报备
    //   this.special = true
    // }
  },

  methods : {
    onFileChange:function (e) {
        var dom=e.currentTarget;
          var files = e.target.files || e.dataTransfer.files;
          if (!files.length) return;
        this.createImage(files);
          
    },
    createImage (file) {
          var vm = this;
          var reader = null;
            reader = new window.FileReader();
            reader.readAsDataURL(file[0]);
            reader.onload = function (e) {
              vm.image=e.target.result;
              lrz(e.target.result)
              .then(function (rst) {
                // 处理成功会执行
                  vm.image = rst.base64;
              })
              .catch(function (err) {
                // 处理失败会执行
                this.getToast("上传图片过大，请重试", "warn");
              })
            }
    },
    delImage() {
          this.image = "";
    },
    confirm () {
      // 申诉成功回到首页
      this.$router.push({path: '/home'});
      this.hasPsdMask = false;
    },
    axiosApi (url, reqData) {
      this.axiosloading()
        axios({
        url:this.getHost()+url, 
        method:'post',
        // data:qs.stringify({
        //   // 拿到用户id和token
        //   Id: 1,
        //   UserId:getCookie('UserId'),
        //   token:getCookie('token'),

        // })
        data: qs.stringify(reqData)
      })
      .then(res=>{
        
        if (res.data.Status===1) {
          this.getToast(res.data.Message,'warn')
          setTimeout(() => {
            this.$router.push({path: '/home'});
          }, 2000);
          
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
      .catch(res=>{
        this.getToast(res.data.Message,'warn')
      })
    },
    submitApply () {
   
      if (this.applyType ==1) {
        // 申请跟进权
        this.applyData = {
          CompanyID: sessionStorage.getItem("ID"),
          SateReason: this.applyReason,     // applyData数据换成你填的就行
          SateImage: this.image,
          UserId:getCookie('UserId'),
          token:getCookie('token'),
        }
        this.url = '/Approval/ApplyFollow'
        // this.axiosApi('Approval/ApplyFollow', reqData);
      } else if(this.applyType == 2){
        //延长
        this.applyData = {
          CompanyID:  sessionStorage.getItem("ID"),
          Day: this.Day,
          SateReason: this.applyReason,
          SateImage: this.image,
          UserId:getCookie('UserId'),
          token:getCookie('token'),
        } 
        this.url = '/Approval/ApplyProtect';
      } else if (this.applyType ==3) {
        // 特殊
         this.applyData = {
          CompanyID:  sessionStorage.getItem("ID"),
          Day: this.Day,
          SateReason: this.applyReason,
          SateImage: this.image,
          UserId:getCookie('UserId'),
          token:getCookie('token'),
        } 
        this.url = '/Approval/ApplySpecial';
      }
       this.axiosApi(this.url, this.applyData);
    },
    
  }
}
</script>

<style scoped>
@import '../../common/input.css';
@import '../../common/mask.css';

.file{
  width: 80px;
  height: 80px;
  position: relative;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}
.file input{
  opacity: 0;
  position: absolute;
  top:0;
  left: 0;
  z-index: 9;
  width: 80px;
  height: 80px;
}
.file img{
  width: 80px;
  height: 80px;
}
.mission_img{
  width: 80px;
  height: 80px;
}
#close{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color:#fff;
  font-size: 12px;
}

  #AppealMaterial{
    padding: 15px;
    box-sizing: border-box;
    height: 100%;
  }
  #button{
    width: calc(100% - 60px);
    margin: 15px auto;
  }
  .AppealReason,.Material,.delayDate,.companyInfo{
    padding: 0 10px;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  .companyInfo .input:last-child{
    border: none;
  }
  .companyInfo span,.companyInfo .arrow{
    margin: 0;
  }
  .delayDate>div{
    display: flex;
    align-items: center;
    height: 45px;
  }
  .delayDate>div input{
    width: 0;
    flex-grow: 1;
  }
  .AppealReason>div{
    padding:10px 0 ;
  }
  .AppealReason>div textarea{
    width: 100%;
    font-size: 14px;
  }
  .title{
    height: 40px;
    background-color: #fff;
    display: flex;
    align-items: center;
    color: #666666;
    font-size: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  .Material{
    height: 45vh;
    margin-bottom: 30px;
  }
  .Material .title{
    border: none;
  }

</style>
