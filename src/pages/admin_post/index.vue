<template>
    <!-- 岗位管理 -->
    <div class="AdminPost">
      <div class="postList">
        <ul>
          <li v-for="(item,index) in list" :key="index">
            <p>{{item.Name}}</p>
            <div class="edit">
              <img src="./edit_03.png" alt="">
              <span @click="editName(item.ID)">编辑岗位名称</span>
            </div>
          </li>
          <!-- <li>
            <p>分公司总经理</p>
            <div class="edit">
                <img src="edit_03.png" alt="">
              <span>编辑岗位名称</span>
            </div>
          </li>

          <li>
            <p>部门经理</p>
            <div class="edit">
                <img src="edit_03.png" alt="">
              <span>编辑岗位名称</span>
            </div>
          </li>
          <li>
            <p>创新经理</p>
            <div class="edit">
                <img src="edit_03.png" alt="">
              <span>编辑岗位名称</span>
            </div>
          </li>
          <li>
            <p>业务员</p>
            <div class="edit">
                <img src="edit_03.png" alt="">
              <span>编辑岗位名称</span>
            </div>
          </li> -->
        </ul>
      </div>
      <!-- 账号管理遮罩 -->
      <div id="mask" v-if="hasMask">
        <div class="maskContain">
          <p class="title">编辑岗位</p>
          <div class="textarea">
            <textarea name="" id="" cols="30" rows="5" v-model="jobName"></textarea>
          </div>
          <div class="btn">
            <span class="cancel" @click="mask(false)">取消</span>
            <span class="confirm" @click="mask(true)">确定</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    import qs from 'qs'
    import axios from "axios";
    export default {
      name: 'AdminPost',
      data(){
        return{
          list:[],
          hasMask:false,
          jobID:-1,
          jobName:''
        }
      },
      created(){
        this.getList()
      },
      methods:{
        getList(){
          console.log(2222)
          this.axiosloading()
          axios({
            url:this.getHost()+'/Notice/JobInfo', 
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
        editName(ID){
          this.hasMask = true
          this.jobID = ID
        },
        mask(bool){
          if (bool) {
            if (!this.jobName) {
              this.getToast("请输入编辑的内容","warn")
              return
            }
            this.axiosloading()
            axios({
              url:this.getHost()+'/Notice/UpdateJobInfo', 
              method:'post',
              data:qs.stringify({
                UserId:getCookie('UserId'),
                token:getCookie('token'),
                ID:this.jobID,
                Name:this.jobName
              })
            })
            .then(res=>{
              console.log(res)
              if (res.data.Status===1) {
                this.jobName =""
                this.hasMask =false
                this.getToast("修改成功",'warn')
                this.getList()
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
          }else{
            this.hasMask = false
          }
        }
      }
    }
  
  </script>
  
  <style scoped>
  @import '../../common/mask.css';
.postList{
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
  padding-top: 20px;
}
.postList ul{
  width: 100%;
  overflow: hidden;

}
.postList ul li{
  width: 100%;
  height:54px;
background:rgba(255,255,255,1);
border-radius:4px;
overflow: hidden;
margin-bottom: 10px;

}
.postList ul li p{
 float: left;
font-size:16px;
font-family:PingFangSC-Regular;
color:rgba(102,102,102,1);
line-height:54px;
padding-left: 12px;
}
.postList ul li .edit{
  float: right;
  width:105px;
height:28px;
border:1px solid rgba(226,199,143,1);
border-radius:4px;
margin-right: 15px;
margin: 12px 12px 14px 0;
}
.postList ul li .edit img{
  float: left;
  display: block;
  width:10px;
  height:10px;
  margin-top: 9px;
  margin-left: 8px;

}
.postList ul li .edit span{
  display: block;
  float: right;
  font-size:12px;
font-family:PingFangSC-Regular;
color:rgba(226,199,143,1);
line-height:28px;
text-align: center;
margin-right: 9px;

}
  
  </style>
  