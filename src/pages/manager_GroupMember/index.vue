<template>
  <!-- 我的小组 -->
  <div id="myGroup">
    <div class="title">
      <p>
        <span>申请人</span>{{data.CreateUserName}}</p>
      <p>选择成员</p>
    </div>
    <div class="groupList" v-for="(item,index) in list" :key="index">
      <div class="name">
        <i></i>
        <span>{{item.Name}}</span>
      </div>
      <div class="teamMemberInfo">
        <p>手机号 {{item.Mobile}}</p>
        <p>跟进{{item.TotalCount}}家装公司，{{item.Count}}家已签约</p>
      </div>
      <div class="icon" v-if="item.IsHead">
        <span>组长</span>
      </div>
      <i class="topIcon">{{index+1}}</i>
    </div>

    <div class="reason">
      <p>申请说明</p>
      <div class="reasonDetail">
        {{data.Reason}}
      </div>
    </div>

    <div class="Allowbtn">
      <a href="javascript:;" id="button" @click="Allow()">通过</a>
      <a href="javascript:;" id="button" class="no" @click="noAllow(true)">不通过</a>
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
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: 'myGroup',
    data() {
      return {
        giveUpReason: '',
        ID: '',
        list: [],
        zuzhang: '',
        deleteShopWarn: false,
        zuzhangId: '',
        follow: false,
        btn: false,
        style: '',
        data: {
          "ID": "",
          "CreateUserName": "",
          "Reason": "",
          "list": []
        },
        isShowMask: false
      }
    },
    created() {
      this.ID = this.$route.query.id
      this.getMyMember()
    },
    computed: {
      ...mapGetters([
        'AccessId'
      ])
    },
    methods: {
      giveUpFollow() {
        if (!this.giveUpReason) {
          this.getToast("请输入不通过原因", 'warn')
        } else {
          axios({
              url: this.getHost() + '/UserInfo/RefuseGroupByID',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                Reason: this.giveUpReason,
                Id: this.ID
              })
            })
            .then(res => {
              console.log(res)
              if (res.data.Status === 1) {
                this.getToast("操作成功", 'correct')
                this.noAllow(false)
                setTimeout(() => {
                  this.$router.push({
                    path: '/home'
                  })
                }, 2000);
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
        }
      },
      noAllow(bool) {
        this.isShowMask = bool
      },
      Allow() {
        axios({
            url: this.getHost() + '/UserInfo/AuditGroupByID',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.ID
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.getToast("审批成功", 'correct')
              setTimeout(() => {
                this.$router.push({
                  path: '/home'
                })
              }, 2000);
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
      getMyMember() {
        axios({
            url: this.getHost() + '/UserInfo/GetAuditGroupUserById',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.ID
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.list = res.data.Data.list
              this.data = res.data.Data
              // console.log(list);
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

    }
  }

</script>

<style scoped>
  @import '../../common/mask.css';
  .Allowbtn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .Allowbtn #button {
    width: calc(100% - 80px);
    /* margin: 15px 0 0;  */
    margin-top: 45px;
  }

  .Allowbtn #button.no {
    background-image: linear-gradient(#ccc);
    margin-top: 15px;
  }

  .reasonDetail {
    /* border: #D4A667 1px solid; */
    min-height: 40px;
    /* margin:0 10px; */
    /* border-radius: 4px; */
    padding: 10px;
    box-sizing: border-box;
    display: flex;
  }

  .reason>p {
    height: 40px;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin-top: 10px;
    border-radius: 4px;
    /* padding-left: 10px; */
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;

  }

  .reason {
    background-color: #fff;
    margin-top: 10px;
    border-radius: 4px;
    padding: 0 15px;
  }

  .title {
    width: 100%;
    display: flex;
    justify-content: center;
    color: #4d4d4d;
    background-color: #fff;
    border-radius: 4px;
    flex-direction: column;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .title p {
    height: 40px;
    display: flex;
    align-items: center
  }

  .title p>span {
    flex-grow: 1;
    width: 0;
  }

  .title p:first-child {
    border-bottom: 1px solid #f0f0f0
  }

  .groupList {
    background-color: #fff;
    /* margin-top: 10px; */
    border-radius: 4px;
    padding: 15px;
    display: flex;
    align-items: center;
    font-size: 12px;
    position: relative;
    margin: 15px;
    box-sizing: border-box;
  }

  .name {
    display: flex;
    width: 100px;
    border-right: 1px solid #f0f0f0;
    margin-right: 15px;
    font-size: 14px;
  }

  .name i {
    width: 6px;
    height: 6px;
    background-color: #ccc;
    border-radius: 3px;
    margin-right: 5px;
    margin-top: 4px;
  }

  .name span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 78%;
  }

  .teamMemberInfo {
    width: 0;
    flex-grow: 1;
  }

  .teamMemberInfo p:first-child {
    margin-bottom: 10px;
  }

  .teamMemberInfo p:nth-child(2) {
    color: #999;
  }

  .icon {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #E2C78F;
    color: #E2C78F;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .topIcon {
    position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    border-radius: 4px 0px 14px;
    background-color: #D4A667;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

</style>
