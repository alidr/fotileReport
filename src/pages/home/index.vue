<template>
  <div id="home">
    <!-- 首页 -->
    <!-- 头部信息 -->
    <div class="home_top">
      <div class="userImg">
        <img src="./userP.png" alt="">
      </div>
      <div class="info">
        <p>{{Name}}</p>
        <p>{{Organization}}</p>
      </div>
      <span @click="PsdMask(true)">账号管理</span>
    </div>
    <!-- 消息中心 -->
    <div class="home_message">
      <div class="msg_top">
        <div class="msgList">
          <router-link to="/companyRetrieval">
            <div class="msgbg0">
              <img src="./index111.png" alt="">
            </div>
            <p>公司检索</p>
          </router-link>
        </div>
        <div class="msgList" v-for="(item,index) in msgList" :key="index">
          <router-link :to="item.Src">
            <div class="msgbg" :class="item.Image">
              <span>{{item.Number}}</span>
              <i></i>
            </div>
            <p>{{item.Name}}</p>
          </router-link>
        </div>
      </div>
      <div class="msg_bottom">
        <router-link to="/announce" class="announce" v-if="annou">发布公告</router-link>
        <router-link to="/addUser" class="addUser" v-if="addUser">新建用户</router-link>
        <router-link to="/addCompany" class="addCompany" v-if="action">新建公司</router-link>
        <router-link to="/appealHome" href="javascript:;" class="appeal" v-if="action">我要申诉</router-link>
      </div>
    </div>
    <router-link to='/applyRenewal'>申请续签</router-link>
    <!-- 最新公告 -->
    <div class="home_newAnnounce">
      <i></i>
      <div class="annouText">
        <p class="time">{{oneAnnounce.CreateDate}}</p>
        <p class="announceMsg">{{oneAnnounce.Content}}</p>
        <p v-if='oneAnnounceFlag' class="annouEmpty">暂无公告</p>

      </div>
      <router-link to="/announceList" class="more">更多</router-link>
    </div>
    <!-- 不同角色的入口模块 -->
    <!-- 重点关注 -->
    <div class="home_content" v-if="buniess">
      <div class="focus" v-if="List.length">
        重点关注({{List.length}})
      </div>
      <div>
        <focusList :list="List" :Action="action" :IsEmphasis=true></focusList>
      </div>
      <div class="lookMore" v-if="List.length>=3">
        <a href="javascript:;" @click="lookMore">查看全部</a>
      </div>
    </div>

    <!-- 最新申诉 -->
    <appealList v-if="appeal" :list="applyList" :AccessId="AccessId" @refresh="getNewApply" @refreshNaav="getNavInfo"></appealList>
    <!-- 账号管理遮罩 -->
    <div id="mask" v-if="hasPsdMask">
      <div class="maskContain">
        <router-link to="/modifyPsd" class="modifyPsd">修改密码</router-link>
        <a href="javascript:;" class="loginOut" @click="logout">退出登录</a>
        <a href="javascript:;" class="cancel" @click="PsdMask(false)">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import focusList from "../../components/focusList";
  import appealList from "../../components/appealList";
  import qs from 'qs'
  import axios from "axios";

  export default {
    name: 'Home',
    data() {
      return {
        //最新申诉显示
        appeal: false,
        //行动
        action: false,
        //重点关注
        List: [],
        //导航
        msgList: [],

        hasPsdMask: false,
        // 重点关注显示3条
        maxHeight: true,
        words: "查看全部",
        //登陆信息
        Name: '',
        Organization: '',
        oneAnnounce: {
          CreateDate: '',
          Content: ''
        },
        oneAnnounceFlag: false,
        // annouTextFlag:true,
        buniess: false,
        applyList: [],
        addUser: false,
        annou: false,
        emptyInfo: false
      }
    },
    components: {
      focusList,
      appealList
    },
    created() {
      //业务员隐藏最新申诉
      if (this.AccessId == 5) {
        this.appeal = false
        this.action = true
        this.buniess = true
        this.getImportant()
      } else if (this.AccessId == -1) {
        this.$router.push({
          path: "/adminIndex"
        })
      } else {
        this.action = false
        this.appeal = true
        this.buniess = false
        this.getNewApply()
      }
      if (this.AccessId == 2 || this.AccessId == 3) {
        this.addUser = true
      }
      if (this.AccessId == 2 || this.AccessId == 1) {
        this.annou = true
      }
      //获取姓名
      this.Name = getCookie("Name");
      this.Organization = getCookie("Organization");
      //获取首页信息
      this.getNavInfo()
      this.getOneAnnounce()



    },
    computed: {
      ...mapGetters([
        'AccessId'
      ])
    },
    methods: {
      PsdMask(bool) {
        this.hasPsdMask = bool
      },
      logout() {
        this.setAccessId('')
        this.delCookie('token')
        this.delCookie('UserId')
        this.delCookie('Name')
        this.delCookie('Organization')
        location.replace('/')
      },
      lookMore() {
        this.$router.push({
          path: '/companyList'
        })
      },
      //获取导航列表
      getNavInfo() {
        axios({
            url: this.getHost() + '/Home/GetHomeButton',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.msgList = res.data.Data
            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
          .catch(res => {
            this.getToast(res.data.Message, 'warn')
          })
      },
      //获取单挑公告
      getOneAnnounce() {
        axios({

            url: this.getHost() + '/Home/LatestNiotice',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.oneAnnounce = res.data.Data
              console.log(this.oneAnnounce)

            } else if (res.data.Status < 0) {
              this.getToast("登录失效，请重新登录", 'warn')
              setTimeout(() => {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              }, 2000);
            } else {
              this.oneAnnounceFlag = true

            }
          })

      },
      //获取重点关注
      getImportant() {
        axios({
            url: this.getHost() + '/Home/Emphasis',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.List = res.data.Data.list
            } else if (res.data.Status < 0) {
              this.getToast("登录失效，请重新登录", 'warn')
              setTimeout(() => {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              }, 2000);
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      getNewApply() {
        axios({
            url: this.getHost() + '/Home/Appeal',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.applyList = res.data.Data.list
            } else if (res.data.Status < 0) {
              this.getToast("登录失效，请重新登录", 'warn')
              setTimeout(() => {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              }, 2000);
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      ...mapMutations({
        setAccessId: 'SET_ACCESSID'
      })
    }
  }

</script>

<style scoped>
  @import '../../common/focusList.css';
  @import '../../common/mask.css';
  #home {
    width: 100%;
    box-sizing: border-box;
  }

  /* 头部信息 */

  .home_top {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0 15px;
    height: 85px;
  }

  .userImg {
    width: 43px;
    height: 43px;
    margin-right: 10px;
  }

  .userImg img {
    width: 100%;
    height: 100%;
  }

  .info {
    width: 0;
    flex-grow: 1;
  }

  .info p:first-child {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .info p:nth-child(2) {
    font-size: 12px;
  }

  .home_top span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    height: 30px;
    background-color: #E2C78F;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
  }

  /* 消息中心 */

  .home_message {
    background-color: #fff;
    padding: 0 20px;
    margin-bottom: 10px;
  }

  .msg_top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    border-top: 1px solid #f0efef;
    border-bottom: 1px solid #f0efef;
    padding-bottom: 10px;
  }

  .msgList {
    width: 25%;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .msgList a {
    color: #000;
  }

  .msgbg0 img{
    display: block;
    width: 64px;
    height: 64px;
    margin: 10px;
  }

  .msgbg {
    width: 64px;
    height: 64px;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #EFBF5F;
    font-size: 20px;
  }

  .msgbg i {
    display: inline-block;
    width: 15px;
    height: 1px;
    background-color: #EFBF5F;
  }

  .msgbg1 {
    background: url(/static/1.png) no-repeat center/contain
  }

  .msgbg2 {
    background: url(/static/2.png) no-repeat center/contain
  }

  .msgbg3 {
    background: url(/static/3.png) no-repeat center/contain
  }

  .msgbg4 {
    background: url(/static/4.png) no-repeat center/contain
  }

  .msgbg5 {
    background: url(/static/5.png) no-repeat center/contain
  }

  .msgbg6 {
    background: url(/static/6.png) no-repeat center/contain
  }

  .msgbg7 {
    background: url(/static/7.png) no-repeat center/contain
  }

  .msgbg8 {
    background: url(/static/8.png) no-repeat center/contain
  }

  .msgbg9 {
    background: url(/static/9.png) no-repeat center/contain
  }

  .msgbg11 {
    background: url(/static/11.png) no-repeat center/contain
  }

  .msgbg10 {
    background: url(/static/10.png) no-repeat center/contain
  }

  .msgList p {
    text-align: center;
  }

  .msg_bottom {
    width: 100%;
    /* height: 80px; */
    display: flex;
    align-items: center;
    padding: 5px;
  }

  .msg_bottom a {
    flex: 1;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    border-radius: 4px;
  }

  .msg_bottom a:last-child {
    margin-right: 0;
  }

  .announce,
  .addUser {
    background-image: linear-gradient(45deg, #E2C78F, #D5AE61);
    color: #fff
  }

  .addCompany,
  .appeal {
    border: 1px solid #E2C78F;
    color: #E2C78F;
    box-sizing: border-box;
  }

  /* 公告 */

  .home_newAnnounce {
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 6px 0;
  }

  .home_newAnnounce i {
    width: 50px;
    height: 35px;
    background: url(./announce.png) no-repeat center/contain;
    margin: 0 5px 0 10px
  }

  .home_newAnnounce .annouText {
    width: 0;
    flex-grow: 1;
    border-left: 1px solid #f0efef;
    padding-left: 15px;

  }

  .home_newAnnounce>div p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .home_newAnnounce .time {
    font-size: 12px;
    color: #ccc;
    margin-bottom: 5px;
  }

  .home_newAnnounce .more {
    margin: 0 20px;
    color: #333;
    font-weight: bold;
  }

  /* 重点关注列表显示三条 */

  .height {
    /* 一个154px */
    max-height: 462px;
    overflow: hidden;
  }


  /* 暂无公告 */

  .annouEmpty {
    color: #ccc;
    font-size: 28px;
    font-weight: 600;
    text-align: center;
  }

</style>
