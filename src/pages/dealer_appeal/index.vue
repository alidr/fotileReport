<template>
  <!-- 申诉审批 -->
  <div class="appeal">
    <div class="btn">
      <button type="button" :class="{active:style==''}" @click="active('')">全部申诉</button>
      <button type="button" :class="{active:style==3}" @click="active(3)">特殊申诉</button>
      <button type="button" :class="{active:style==2}" @click="active(2)">保护期申诉</button>
      <button type="button" :class="{active:style==1}" @click="active(1)">跟进权申诉</button>
    </div>
    <div class="appealList">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="applyDetail(item.ID)">
          <span :class="{red:item.TypeID==1,yellow:item.TypeID==2,grey:item.TypeID==3}">{{item.TypeName}}</span>

          <div class="up">
            <span class="CompanyName">{{item.CompanyName}} </span>
            <!-- <span class="UserName">业务员{{item.UserName}}</span> -->
            <div class="upBtn">
              <button type="button" class="no" @click.stop="noAllow(true,item.ID)" v-if="btn">不通过</button>
              <button type="button" class="yes" @click.stop="isAllow(true,item.ID)" v-if="btn">审批通过</button>
            </div>
          </div>
          <div class="down">
            <i>申诉日期：{{item.CreateDate}}</i>
            <a href="javascript:;">
              <span>查看申诉详情>></span>
            </a>
          </div>
        </li>
      </ul>
      <empty v-if='emptyFlag'></empty>
    </div>

    <div id="mask" v-if="isShowMask">
      <div class="maskContain">
        <p class="title">审批不通过原因</p>
        <div class="textarea">
          <textarea name="" id="" cols="30" rows="6" v-model="giveUpReason"></textarea>
        </div>
        <div class="btn">
          <span class="cancel" @click="noAllow(false)">取消</span>
          <span class="confirm" @click.stop="isAllow(false)">确认</span>
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
  } from 'vuex';
  import empty from '../../components/empty'
  export default {
    name: 'appeal',
    data() {
      return {
        list: [],
        emptyFlag: false,
        style: '',
        btn: true,
        isShowMask: false,
        giveUpReason: '',
        Id: ''
      }
    },
    components: {
      empty
    },
    computed: {
      ...mapGetters([
        'AccessId'
      ])
    },
    created() {
      this.getList("")
      if (this.AccessId == 4) {
        this.btn = false
      }
    },
    methods: {
      getList(TypeID) {
        axios({
            url: this.getHost() + '/Approval/GetApplyList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              TypeID: TypeID,
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.list = res.data.Data.list
              if (this.list == '') {
                this.emptyFlag = true
              } else {
                this.emptyFlag = false
              }
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
      active(style) {
        this.style = style
        this.getList(style)
      },
      isAllow(bool, id) {
        if (bool) {
          axios({
              url: this.getHost() + '/Approval/AgreeSate',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                Id: id,
              })
            })
            .then(res => {
              console.log(res)
              if (res.data.Status === 1) {
                this.getToast("操作成功", 'warn')
                this.getList(this.style)
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
        } else {
          if (!this.giveUpReason) {
            this.getToast("请输入不通过的原因", 'warn')
            return
          }
          axios({
              url: this.getHost() + '/Approval/CancelSate',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                Id: this.Id,
                Reason: this.giveUpReason
              })
            })
            .then(res => {
              console.log(res)
              if (res.data.Status === 1) {
                this.getToast("操作成功", 'warn')
                this.getList(this.style)
                this.noAllow(false)
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
      applyDetail(id) {
        console.log(id);

        this.$router.push({
          path: '/appealDetails',
          query: {
            id: id
          }
        })
      },
      noAllow(bool, id) {

        this.isShowMask = bool
        console.log(bool);

        if (bool) {
          this.Id = id
        } else {
          this.giveUpReason = ''
        }
      },

    }

  }

</script>

<style scoped>
  @import '../../common/mask.css';
  .red {
    border: 1px solid #F26F53;
    color: #F26F53
  }

  .yellow {
    border: 1px solid #BB9F61;
    color: #BB9F61;
  }

  .grey {
    border: 1px solid #BFBFBF;
    color: #BFBFBF;
  }

  .appeal {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .btn {
    width: 94%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
  }

  .btn button {
    height: 29px;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(179, 179, 179, 1);
    border: 1px solid #959595;
    background: none;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .btn button.active {
    background: #E2C78F;
    color: rgba(255, 255, 255, 1);
    border: none
  }


  .appealList {
    width: 94%;
    margin: 0 auto;
    overflow: hidden;
  }

  .appealList ul li {
    overflow: hidden;
    background: white;
    padding: 12px 8px 16px 20px;
    margin-bottom: 9px;
  }

  .appealList ul li .up {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #F0F0F0;
    padding-bottom: 8px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
  }

  .appealList ul li>span {
    display: inline-block;
    height: 20px;
    border-radius: 3px;
    line-height: 20px;
    text-align: center;
    /* border: 1px solid #BFBFBF; */
    padding: 0 10px;
    font-size: 12px;
    /* color: rgba(191, 191, 191, 1); */
    margin-bottom: 6px;
  }

  .appealList ul li .up .CompanyName {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 18px;
    width: 58%;
    word-break: break-all;
  }

  .appealList ul li .up .UserName {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 28px;
    margin-left: 4px;
  }

  .appealList ul li .up .upBtn {
    display: flex;
    width: 40%;
    justify-content: space-between;
    position: relative;
  }

  .appealList ul li .up .upBtn button {
    display: block;
    border-radius: 3px;
    padding: 0 10px;
    line-height: 28px;
    height: 28px;
    text-align: center;
    font-size: 12px;
    position: absolute;
    top:0;
    bottom: 0;
    margin: auto;
  }

  .appealList ul li .up .upBtn .no {
    background: rgba(228, 228, 228, 1);
    color: rgba(178, 178, 178, 1);
    left: 0;
  }

  .appealList ul li .up .upBtn .yes {
    background: rgba(226, 199, 143, 1);
    color: rgba(255, 255, 255, 1);
    right: 0;
  }

  .appealList ul li .down {
    display: flex;
    justify-content: center;
  }

  .appealList ul li .down i {
    font-style: normal;
    font-size: 12px;
    color: rgba(242, 111, 83, 1);
    flex-grow: 1;
    width: 0;
  }

  .appealList ul li .down a {
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
    /* margin-left: 110px; */
  }

</style>
