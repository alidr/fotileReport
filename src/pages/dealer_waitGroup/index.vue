<template>
    <!-- 待审批小组 -->
  <div class="waitGroup">
    <div class="title">
      当前一共有
      <span>{{list.length}}</span>个小组待审批
    </div>
    <div class="waitGroupList">
      <ul>
        <li v-for="(item,index) in list" :key ='index' @click="groupDetail(item.ID)">
          <span>{{index+1}}</span>
          <div class="listTop">
            <p>组长 {{item.Name}} {{item.Mobile}}</p>
            <div class="upBtn">
              <button type="button" class="no" @click.stop="noAllow(true,item.ID)">不通过</button>
              <button type="button" class="yes" @click.stop="Allow(item.ID)">审批通过</button>
            </div>
          </div>
          <div class="listBottom">
            <i>申请人 {{item.CreateUserName}}</i>
            <i class="reason">说明 {{item.Reason}}</i>
            <router-link to="/">
              <span>查看申诉详情>></span>
            </router-link>
          </div>
        </li>
      </ul>
    </div>

       <!-- 遮罩 -->
    <div id="mask" v-if="isShowMask">
      <div class="maskContain">
        <p class="title">审批不通过原因</p>
        <div class="textarea">
          <textarea name="" id="" cols="30" rows="6" v-model="giveUpReason"></textarea>
        </div>
        <div class="btn">
          <span class="cancel" @click="noAllow(false)">取消</span>
          <span class="confirm" @click.stop="giveUpFollow">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
  export default {
    name: 'waitGroup',
    data() {
      return {
        list:'',
        isShowMask:false,
        giveUpReason:'',
        ID:''

      }
    },
    created(){
      this.getList()
    },
    methods:{
      groupDetail(id){
        this.$router.push({
          path:'/groupMember',
          query:{
            id:id
          }
        })
      },
      giveUpFollow(ID){
        if (!this.giveUpReason) {
          this.getToast("请输入不通过原因",'warn')
        }else{
          axios({
          url:this.getHost()+'/UserInfo/RefuseGroupByID', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Reason:this.giveUpReason,
            Id:this.ID
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.getToast("操作成功",'correct')
            this.getList()
            this.noAllow(false)
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
      },
      noAllow(bool,id){
        this.isShowMask = bool
        if (bool) {
          this.ID = id
        }
      },
      getList(){
        axios({
          url:this.getHost()+'/UserInfo/GetAuditGroupList', 
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
      Allow(id){
        axios({
        url:this.getHost()+'/UserInfo/AuditGroupByID', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Id:id
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("审批成功",'correct')
          this.getList()

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
@import '../../common/mask.css';
  .waitGroup>.title {
    background: rgba(255, 245, 231, 1);
    font-size: 12px;
    font-family: PingFangSC-Light;
    color: rgba(211, 180, 136, 1);
    line-height: 34px;
    padding-left: 16px;
    margin-bottom: 10px;
  }

  .waitGroupList {
    width: 96%;
    overflow: hidden;
    margin: 0 auto;
  }

  .waitGroupList ul {
    width: 100%;
    overflow: hidden;
  }

  .waitGroupList ul li {
    width: 100%;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    margin-bottom: 15px;
    padding-bottom: 18px;
    position: relative;
  }



  .waitGroupList ul li .listTop {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    border-bottom: 1px solid #B1B1B1;
    padding-bottom: 10px;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .waitGroupList ul li .listTop p {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
  }

  .waitGroupList ul li>span {
    display: block;
    width: 26px;
    height: 24px;
    background: #D4A667;
    border-radius: 6px 0;
    float: left;
    line-height: 24px;
    text-align: center;
    color: #FBF7EE;
    position: absolute;
    top:0;left: 0;

  }

  .upBtn {
    display: flex;
    width: 40%;
    justify-content: space-between;
   
  }

  .upBtn button {
    display: block;
    border-radius: 3px;
    padding: 0 10px;
    line-height: 28px;
    text-align: center;
    font-size: 12px;
  }

  .upBtn .no {
    background: rgba(228, 228, 228, 1);
    color: rgba(178, 178, 178, 1);
  }

  .upBtn .yes {
    background: rgba(226, 199, 143, 1);
    color: rgba(255, 255, 255, 1);
  }


  .waitGroupList ul li .listTop span img {
    display: block;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }




  .waitGroupList ul li .listBottom {
    display: flex;
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 10px;
    justify-content: space-between;
  }


  .waitGroupList ul li .listBottom a {
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
  }

  .waitGroupList ul li .listBottom i {
    font-style: normal;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
  }

  .reason{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 40%;
  }

</style>
