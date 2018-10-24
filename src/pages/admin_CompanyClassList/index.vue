<template>
  <!-- 公司分类管理 -->
  <div class="CompanyClassList">
    <button class="addClass" type="button" @click="edit()">添加分类</button>
    <div class="classList">
      <ul>
        <li v-for="(item,index) in list" :key="index"> 
          <p>{{item.Name}}</p>
          <div class="picture">
            <img src="./del_03.png" alt="" @click="deleteShopMask(true,item.ID)">
            <img src="./edit_03.png" alt="" @click="edit(item.ID)">
          </div>
        </li>
      </ul>
    </div>

    <!-- 账号管理遮罩 -->
    <div id="mask" v-if="hasMask">
      <div class="maskContain">
        <p class="title">编辑类型</p>
        <div class="textarea">
          <textarea name="" id="" cols="30" rows="5" v-model="jobName"></textarea>
        </div>
        <div class="btn">
          <span class="cancel" @click="mask(false)">取消</span>
          <span class="confirm" @click="mask(true)">确定</span>
        </div>
      </div>
    </div>

    <div id="mask" v-show="deleteShopWarn">
      <div class="maskContain">
        <div class="content">
          确认删除吗？
        </div>
        <div class="btn">
          <span class="cancel" @click="deleteShopMask(false)">取消</span>
          <span class="confirm" @click="deleteStyle()">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";

  export default {
    name: 'CompanyClassList',
    data(){
      return{
        list:[],
        hasMask:false,
        jobName:'',
        jobID:'',
        deleteShopWarn:false,
        shopID:''
      }
    },
    created(){
      this.getList()
    },
    methods:{
      
      deleteShopMask(bool,ID){
        this.deleteShopWarn = bool;
        this.shopID = ID||""
      },

      getList(){
        axios({
          url:this.getHost()+'/Notice/CompanyList', 
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
      edit(ID){
        this.hasMask = true
        this.jobID = ID
      },
      mask(bool){
          if (bool) {
            if (!this.jobName) {
              this.getToast("请输入编辑的内容","warn")
              return
            }
            axios({
              url:this.getHost()+'/Notice/CompanyEdit', 
              method:'post',
              data:qs.stringify({
                UserId:getCookie('UserId'),
                token:getCookie('token'),
                ID:this.jobID||"",
                Name:this.jobName
              })
            })
            .then(res=>{
              console.log(res)
              if (res.data.Status===1) {
                this.jobName =""
                this.hasMask =false
                this.getToast("操作成功",'warn')
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
        },
        deleteStyle(id){
           axios({
              url:this.getHost()+'/Notice/DeleteCompany', 
              method:'post',
              data:qs.stringify({
                UserId:getCookie('UserId'),
                token:getCookie('token'),
                ID:this.shopID
              })
            })
            .then(res=>{
              console.log(res)
              if (res.data.Status===1) {
                this.hasMask =false
                this.getToast("删除成功",'warn')
                this.deleteShopMask(false)
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
        }
    }
  }

</script>

<style scoped>
  @import '../../common/mask.css';
  .CompanyClassList {
    width: 100%;
    overflow: hidden;
    padding-top: 18px;
  }

  .addClass {
    display: block;
    width: 80%;
    height: 40px;
    border-radius: 20px;
    box-shadow: 0px 8px 15px rgba(223, 174, 72, 0.2);
    margin: 0 auto;
    background:#D5AE61;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    text-align: center;
    margin-bottom: 20px
  }

  .classList {
    width: 90%;
    overflow: hidden;
    margin: 0 auto;
  }

  .classList ul {
    width: 100%;
    overflow: hidden;
  }

  .classList ul li {
    width: 100%;
    height: 54px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .classList ul li p {
    float: left;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    line-height: 54px;
    padding-left: 12px;
  }

  .classList ul li .picture {
    float: right;
    overflow: hidden;
    margin-right: 18px;
    padding-top: 12px;
  }

  .classList ul li .picture img {
    float: left;
    display: block;
    width: 30px;
    height: 30px;
    margin-left: 12px;

  }

</style>
