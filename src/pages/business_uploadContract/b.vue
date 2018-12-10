<template>
  <!-- 上传合同 -->
  <div id="uploadContract">
     
      <cube-upload
        ref="upload"
        v-model="files"
        :action="action"
        :auto=false
        :max=1
        @files-added="addedHandler"
        @file-error="errHandler">
        <div class="clear-fix">
          <cube-upload-file v-for="(file, i) in files" :file="file" :key="i"></cube-upload-file>
          <cube-upload-btn :multiple="false">
            <div class="unloadImg">
              <i>＋</i>
            </div>
          </cube-upload-btn>
        </div>
      </cube-upload>

    <div class="btn">
      
      <a href="javascript:;" id="button"  class="confirm" @click="upload">确认上传</a>
      <a href="javascript:;" class="cancel" id="button" @click="cancel">取消上传</a>
    </div>
    <div class="msg">
      <p>1、签约合同在审核失败的时候可以重新上传 </p>
      <p>2、凭证多次重新上传</p>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";

export default {
  data() {
    return {
      action:{
        target:this.getHost()+'/Company/ContractImageSave',
        data: {
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          CompanyID:this.CompanyID,
        }
      },
      style:'',
      files: []
    }
  },
  created(){
    this.CompanyID = this.$route.query.id
    this.style = this.$route.query.style
  },
  methods: {
    addedHandler() {
      const file = this.files[0]
      console.log(file);
      
      file && this.$refs.upload.removeFile(file)
    },
    errHandler(file) {
      // const msg = file.response.message
      this.$createToast({
        type: 'warn',
        txt: 'Upload fail',
        time: 1000
      }).show()
    },
    upload(){
      console.log(111);
      
      this.$refs.upload.start()
    },
    cancel(){
       this.$router.push({
          path:'/companyDetail',
          query:{
            id:this.CompanyID
          }
      })
    }
  }
}
</script>

<style scoped>
#uploadContract{
  width: 100%;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
}
.unloadImg{
  width: 100%;
  height: 60vh;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: #ccc
}
/* .unloadImg>input{
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 72vh;
} */
.unloadImg img{
  width: 100%;
  height: 72vh;
}

.btn{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  position: absolute;
  bottom: 60px;
  width: 100%;
}

#button{
  display: block;
  width: calc(100% - 60px);
  text-align: center;
}

#button.cancel{
  background-image:linear-gradient(#ccc,#ccc);
  margin-top: 25px;
}

.msg{
  width: 100%;
  height: 50px;
  background-color: #fff5e7;
  color:#d3b488;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-left: 20px;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
}


</style>
