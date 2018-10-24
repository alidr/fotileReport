<template>
  <!-- 登录 -->
  <div id="login">
    <img src="./bg.png" alt="">
    <p class="login_name">家装报备工具</p>
    <div class="big">

    <div class="login_content">
      <div class="input">
        <span></span>
        <input type="text" placeholder="请输入您的账户" v-model="name">
      </div>
      <div class="input">
        <span></span>
        <input type="password" placeholder="请输入您的密码" v-model="psd">
      </div>
      <a href="javascript:;" id="button" @click="login()">欢迎登录</a>
    </div>
  </div>
    


  </div>
</template>
<script>
  import {
    mapMutations
  } from 'vuex'
  import axios from "axios"
  import qs from "qs";

  export default {
    name: 'Login',
    data() {
      return {
        name: '',
        psd: '',
        AccessId: ''
      }
    },
    methods: {
      login() {
        if (!this.name) {
          this.getToast("请输入用户名", 'warn')
          return
        } else if (!this.psd) {
          this.getToast("请输入密码", 'warn')
          return
        }
        this.axiosloading()
        axios({
            url: this.getHost() + '/Login/Login',
            method: 'post',
            data: qs.stringify({
              LoginName: this.name,
              Password: this.psd
            })
          })
          .then(res => {
            if (res.data.Status == 1) {
              this.AccessId = res.data.Data.JobID
              this.setAccessId(this.AccessId)
              let cookie = res.data.Data.Token
              let id = res.data.Data.ID
              let Name = res.data.Data.Name
              let Organization = res.data.Data.Organization
              this.addCookie('token', cookie, 1)
              this.addCookie('UserId', id, 1)
              this.addCookie('Name', Name, 1)
              this.addCookie('Organization', Organization, 1)
              if (this.AccessId == -1) {
                this.$router.push({
                  path: '/adminIndex'
                })
              } else {
                this.$router.push({
                  path: '/home'
                })
              }
            } else if (res.data.Status == 0) {
              const toast = this.$createToast({
                txt: res.data.Message,
                mask: true,
                type: 'warn',
                maskClosable: true,
                time: 1000,
              })
              toast.show()
              return
            }else if (res.data.Status == 403) {
              window.location.href = res.data.Message
            }
          })
      },
      // login(AccessId) {
      //   this.setAccessId(AccessId)
      //   this.$router.push({path:'/home'})
      // },
      ...mapMutations({
        setAccessId: 'SET_ACCESSID'
      })
    }
  }

</script>

<style scoped>
  #login {
    width: 100%;
    height: 100%;
    background-color: #f5f4f3;
    background-repeat: no-repeat;
    background-size: contain;
  }

  /* 登录名称 */
  #login img{
    position: absolute;
    display: block;
    width: 100%;
    height: 202px;
    top: 0;
    left: 0;

  }
  .login_name {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #e0c799;
    top:72px;
  }

  /* 登录内容 */
  .big{
    height: 100%;
    display: flex;

  }
  .login_content {
    width: 88%;
    height: 396px;
    padding: 30px 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background: white;
    margin: 0 auto;
    -webkit-box-shadow: 0px 4px 37px 6px #f3efea;
    box-shadow: 0px 9px 12px 0px #f3efea;
    border-radius: 3%;
    margin: auto;
    z-index: 800;
    margin-top: 174px;
  }

  .input {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    background-color: #fbfbfb;
  }

  .input span {
    display: inline-block;
    width: 25px;
    height: 25px;
    margin: 0 10px;
  }

  .input input {
    width: 0;
    flex: 1;
    height: 100%;
    background-color: #fbfbfb;
  }

  .input:nth-child(1) span {
    background: url(./user.png) no-repeat center/cover;
  }

  .input:nth-child(2) span {
    background: url(./psd.png) no-repeat center/cover;
  }

  .login_content #button {
    width: 100%;
    margin-top: 20vh;
  }

</style>
