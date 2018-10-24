<template>
  <!-- 管理员首页 -->
  <div class="AdminIndex">
    <div class="top">
      <!-- 用户信息 -->
      <div class="userMsg">
        <div class="userPic">
          <img src="./user.png" alt="">
        </div>
        <p>管理员</p>
        <a href="javascript:;" class="admin" @click="PsdMask(true)">
          <span>账号管理</span>
        </a>
      </div>
      <!-- 快捷入口 -->
      <div class="enter">
        <h3>
          <span>|</span> 快捷入口</h3>
        <ul>
          <li>

            <router-link to="/addUser" class="newUser">
              <span>新建用户</span>
            </router-link>
          </li>
          <li>
            <router-link to="/addCompany" class="newCompy">
              <span>新建公司</span>
            </router-link>
          </li>
          <li>
            <router-link to="/announce" class="notice">
              <span>发布公告</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="nav">
      <ul>
        <li>
          <router-link to="./UserList">
            <div class="img">
              <img src="./admin1.png" alt="">

            </div>
            <p>用户管理</p>
          </router-link>
        </li>
        <li>
          <router-link to="./AdminPost">
            <div class="img">
              <img src="./admin2.png" alt="">

            </div>
            <p>岗位管理</p>
          </router-link>
        </li>
        <li>
          <router-link to="./companyList">
            <div class="img">
              <img src="./admin3.png" alt="">
            </div>
            <p>家装公司管理</p>
          </router-link>
        </li>
        <li>
          <router-link to="./announceList">
            <div class="img">
              <img src="./admin4.png" alt="">
            </div>
            <p>公告管理</p>
          </router-link>
        </li>
        <li>
          <router-link to="./CompanyFollow">
            <div class="img">
              <img src="./admin5.png" alt="">

            </div>
            <p>公司待跟进</p>
          </router-link>
        </li>
        <li>
          <router-link to="./CompanyClassList">
            <div class="img">
              <img src="./admin6.png" alt="">

            </div>
            <p>公司分类管理</p>
          </router-link>
        </li>
        <li>
          <router-link to="./announceStyle">
            <div class="img">
              <img src="./admin7.png" alt="">

            </div>
            <p>公告类型管理</p>
          </router-link>
        </li>

      </ul>
    </div>
    <!-- 账号管理遮罩 -->
    <div id="mask" v-if="hasPsdMask">
      <div class="maskContain">
        <router-link to="/modifyPsd" class="modifyPsd">修改密码</router-link>
        <a href="javascript:;" class="loginOut"  @click="out">退出登录</a>
        <a href="javascript:;" class="cancel" @click="PsdMask(false)">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import {loginOut} from "../../utils/loginOut";
  export default {
    name: 'AdminIndex',
    data(){
      return{
        hasPsdMask:false
      }
    },
    methods:{
      PsdMask(bool){
        this.hasPsdMask = bool
      },
      out() {
          loginOut()
          .then(res => {
            this.delCookie("UserId")
            this.delCookie("token")
            this.setAccessId('')
            location.replace('/')
        })
      },
      ...mapMutations({
      setAccessId: 'SET_ACCESSID'
      })
    }
  }

</script>

<style scoped>
@import '../../common/mask.css';
  .AdminIndex {
    width: 100%;
    overflow: hidden;
  }

  .top {
    width: 88%;
    overflow: hidden;
    margin: 0 auto;
    padding: 20px 6% 0 6%;
    background: white;
    margin-bottom: 16px;
  }

  .top .userMsg {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #F0F0F0;
    margin-bottom: 15px;
    padding-bottom: 18px;
  

  }

  .top .userMsg .userPic {
    float: left;
    width: 14%;
    height: 43px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .top .userMsg .userPic img {
    width: 100%;
  }

  .top .userMsg p {
    float: left;
    width: 20%;
    font-size: 14px;
    color: rgba(77, 77, 77, 1);
    line-height: 43px;
  }

  .top .admin {
    float: right;
    display: block;
    width: 20%;
    margin-top: 8px;
    margin-right: 4px;
  }

  .top .admin span {
    font-size: 12px;
    color: #fff;
    display: block;
    width: 100%;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: rgba(226, 199, 143, 1);
    border-radius: 4px;

  }

  .enter {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
  }

  .enter h3 {
    font-size: 17px;
    color: rgba(77, 77, 77, 1);
  }

  .enter h3 span {
    display: block;
    float: left;
    font-size: 16px;
    color: #D5AE61;
    margin-right: 2px;
  }

  .enter ul {
    width: 96%;
    display: flex;
    justify-content: space-between;
    /* flex-wrap: wrap; */
    padding-top: 24px;
    margin: 0 auto;
    padding-bottom: 34px;
  }

  .enter ul li {
    width: 28%;
    height: 44px;
    overflow: hidden;
    background: rgba(212, 212, 212, 1);
    border-radius: 8px;
  }

  .enter ul li:nth-child(1) {
    width: 28%;
    height: 44px;
    overflow: hidden;
    background:#E2C78F;
    border-radius: 8px;
    background: linear-gradient(left, #E2C78F, #D5AE61);
    box-shadow: 0px 2px 10px rgba(223, 174, 72, 0.2);
  }
  .enter ul li:nth-child(2) {
    width: 28%;
    height: 44px;
    overflow: hidden;
    background: #fff;
    border:1px solid #D5AE61;
    border-radius: 8px;
    /* box-shadow: 0px 2px 10px rgba(223, 174, 72, 0.2); */
  }
  .enter ul li:nth-child(3) {
    width: 28%;
    height: 44px;
    overflow: hidden;
    background:#D5AE61;
    border-radius: 8px;
    background: linear-gradient(left, #E2C78F, #D5AE61);
    box-shadow: 0px 2px 10px rgba(223, 174, 72, 0.2);
  }
  .enter ul li:nth-child(2) a{
   display: block;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 44px;
    text-align: center;
    overflow: hidden;
    background: none;
    color: #E2C78F;
    /* box-shadow: 0px 2px 10px rgba(223, 174, 72, 0.2); */
  }
  .enter ul li a {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 44px;
    text-align: center;
  }

.nav{
  width: 100%;
  overflow: hidden;
  background: white;
  padding-top: 22px;
}
.nav ul{
  width: 88%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0 auto;
}
.nav ul li{
  width: 26%;
  overflow: hidden;
  margin-bottom: 40px;
}
.nav ul li a{
  display: block;
   width: 100%;
  overflow: hidden;

}
.nav ul li a .img{
  width: 100%;
  height: 62px;
  overflow: hidden;
  position: relative;
}
.nav ul li a .img img {
    display: block;
    width: 62px;
    height: 62px;
    position: absolute;
    top: 0;bottom: 0;left: 0;right: 0;
    margin: auto;
  }

  .nav ul li a p {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    text-align: center;
    padding-top: 14px;
  }

</style>
