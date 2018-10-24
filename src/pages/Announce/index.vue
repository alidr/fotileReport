<template>
<!-- 发布公告 -->
  <div id="Announce">
    <div class="input">
        <span>公告类型</span>
        <input type="text" placeholder="请选择通告类型" v-model="JobInfo" 
        :jobId = "jobId" @click="showPicker" readonly>
        <i class="arrow"></i>
    </div> 
    <div class="announceDetail">
      <p class="title">公告详情</p>
      <div>
        <textarea name="" id="" cols="30" rows="6" v-model="anDetail" placeholder="请输入公告详情"></textarea>
      </div>
    </div>
    <div class="noticePerson">
      <p class="title">通知人（多选）</p>
      <div class="player">
        <p>
          <span :class='{active:isActive[idx]}' v-for='(item,idx) in list' :key="idx" @click="getActive(idx,item.ID)">{{item.Name}}</span>
        </p>
      </div>
    </div>
    <a href="javascript:;" id="button" @click="commitAn">发布</a>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";

export default {
  name: 'Announce',
  data(){
    return{
      list:[],
      isActive:[],
      anstyle:'',
      anDetail:'',
      idList:[],
      JobInfo:'',
      jobId:'',
    }
  },
  created(){
    this.getData()
    this.getPickerConfig()
  },

  methods:{
    //公司分类Picker
    getPickerConfig() {
      axios({
        url:this.getHost()+'/Notice/NoticeTypeList', 
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
    //配置分类picker
    initPicker(data){
      this.picker = this.$createPicker({
        title: '公告类型',
        alias: {
          value: 'ID',
          text: 'Name'
        },
        data: [data],
        onSelect: (selectedVal, selectedIndex, selectedText) => {
          this.LastInfo = ""
          this.JobInfo = selectedText
          this.jobId = selectedVal[0]
          console.log("this.jobId",this.jobId);
          
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
    getActive(idx,id){
      
      if (!this.isActive[idx]) {
        if (idx==0) {
          this.idList = []
          for (let i = 1; i < this.list.length; i++) {
              this.idList.push(this.list[i].ID)
          }
          console.log(this.idList);
          
        }else{
          this.idList.push(id)
        }
      }else{
        for (let i = 0; i < this.idList.length; i++) {
          if (this.idList[i]==id) {
            this.idList.splice(i)
          }
        }
      }


     
      this.isActive[idx] = !this.isActive[idx]
      this.isActive = this.isActive.slice()
    },
    //获取数据
    getData(){
      this.axiosloading()
      axios({
        url:this.getHost()+'/Notice/GetNoticeJob', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token')
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          
          this.list = res.data.Data.list
          this.list.unshift({ID: 0, Name: "全部"})
          for (let i = 0; i < this.list.length; i++) {
            this.isActive.push(false)
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
    commitAn(){
      console.log(this.jobId);
      
      if (!this.jobId) {
        this.getToast("请选择公告类型",'warn')
        return
      }else if (!this.anDetail) {
         this.getToast("请输入公告详情",'warn')
        return
      }else if (this.idList.length==0) {
         this.getToast("请选择要通知的人员",'warn')
        return
      }
      this.axiosloading()
      axios({
        url:this.getHost()+'/Notice/AddNotice', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          TypeID:this.jobId,
          Content:this.anDetail,
          JobID:this.idList,
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("发布公告成功,将跳转至公告管理",'warn')
          setTimeout(() => {
            this.$router.push({path: '/announceList'})
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
    }
  }
}
</script>

<style scoped>
@import '../../common/input.css';
@import '../../common/filter.css';
#Announce{
  padding: 15px;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}
.input{
  border: none;
  border-radius: 4px;
}
.announceDetail,.noticePerson{
  padding: 0 10px;
  background-color: #fff;
  border-radius: 4px;
  margin: 15px 0;
}
.announceDetail>div{
  padding:10px 0 ;
}
.announceDetail>div textarea{
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
.player{
  margin-top: 20px;
}
.player p{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* justify-content: space-between; */
}
.player p span{
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ccc;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px 0;
  margin-bottom: 20px;
  margin-right: 8px;
}
.player p span:last-child{
  margin-right: 0;
}
.player p span.active{
  background-color: #E2C78F;
  color: #fff;
  border: none;
}
#button{
  width: calc(100% - 60px);
  margin: 15vh auto 0;
}

</style>
