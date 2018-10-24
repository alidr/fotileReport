<template>
  <!-- 申诉审批 -->
  <div class="appeal">
    <div class="btn">
      <button type="button" :class="{active:style==1}" @click="active(1)">授权审批</button>
      <button type="button" :class="{active:style==2}" @click="active(2)">合同审批</button>
    </div>
    <div class="appealList">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="applyDetail(item.CompanyID)">
          <span>{{item.TypeName}}</span>
          <i>提交日期 {{item.Date}}</i>
          <div class="up">
            <p class="name">{{item.CompanyName}} </p>
            <!-- <b class="salesman">业务员{{item.UserName}}</b> -->
            <div class="upBtn">
              <button type="button" class="no" @click.stop="noAllow(true,item.ID)">不通过</button>
              <button type="button" class="yes" @click.stop="isAllow(true,item.ID)">审批通过</button>
            </div>
          </div>
          <div class="down">
            <i @click.stop="showListMask(true,item.CompanyID)">查看相似公司</i>
            <a href="javascript:;">
              <span>查看公司详情>></span>
            </a>
          </div>
        </li>
      </ul>
      <!-- <div class="empty" v-if='emptyFlag'>
        <img src="./images/empty.png" alt="">
        <p>这里暂时还没有内容…</p>
      </div> -->
      <empty v-if='emptyFlag'></empty>
    </div>
    <!-- 遮罩 -->
    <div id="mask" v-if="listmask" @click="showListMask(false)">
      <div class="maskContain">
        <ul>
          <li>
            <span class="name">公司名称 </span>
            <span>相似度</span>
          </li>
          <li v-for="(item,index) in similadList" :key="index">
            <span class="name">{{item.Name}} </span>
            <span>{{item.Rate}}%</span>
          </li>
        </ul>
        <button type="button" @click="showListMask(false)" class="close">关闭</button>
      </div>
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
          <span class="confirm" @click.stop="isAllow(false,ID)">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'qs';
  import axios from "axios";
  import empty from "../../components/empty";
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'appeal',
    data() {
      return {
        list: [],
        style: 1,
        similadList: '',
        listmask: false,
        emptyFlag: false,
        listFlag: true,
        isShowMask:false,
        giveUpReason:'',
        ID:''
      }
    },
    components:{
      empty

    },
    created() {
      this.getList(1)

    },
    methods: {
      noAllow(bool,id){
        this.isShowMask = bool
        if (bool) {
          this.ID = id
        }else{
          this.giveUpReason = ""
        }
      },
      showListMask(bool, id) {
        this.listmask = bool
        if (bool) {
          console.log(id);

          this.getSimilarList(id)
        }
      },
      getSimilarList(id) {
        this.axiosloading()
        axios({
            url: this.getHost() + '/Approval/GetLikeness',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              CompanyID: id
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.similadList = res.data.Data
            } else if (res.data.Status < 0) {
              this.getToast(res.data.Message, 'warn')
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
      getList(TypeID) {
        this.axiosloading()
        axios({
            url: this.getHost() + '/Approval/GetFollowList',
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
        console.log(style);

        this.style = style
        this.getList(style)
      },
      isAllow(bool, id) {
        if (!bool) {
          if (!this.giveUpReason) {
            this.getToast("请输入不通过得原因",'warn')
            return
          }
          this.axiosloading()
           axios({
            url: this.getHost() + '/Approval/CancelFollow',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: id,
              Reason:this.giveUpReason
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
        }else{
           axios({
            url: this.getHost() + '/Approval/AgreeFollow',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: id
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.getToast("操作成功", 'warn')
              this.getList(this.style)
              this.noAllow(false)
            } else if (res.data.Status < 0) {
              this.getToast("res.data.Message", 'warn')
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
        this.$router.push({
          path: '/companyDetail',
          query: {
            id: id
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
  @import '../../common/mask.css';
  .maskContain .close {
    display: block;
    padding: 0 24px;
    font-size: 13px;
    font-family: PingFangSC-Regular;
    color: rgba(152, 152, 152, 1);
    background: rgba(237, 236, 235, 1);
    border-radius: 2px;
    line-height: 34px;
    text-align: center;
    margin: 0 auto;
  }
  .maskContain{
    padding: 15px !important;
  }
  .maskContain li .name{
    flex-grow: 1;
    width: 0;
  }
  .maskContain li {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 0;
  }

  .maskContain li:last-child {
    border-bottom: none;
  }

  .btn {
    width: 58%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
  }

  .btn button {
    display: black;
    height: 29px;
    border-radius: 4px;
    padding: 0 22px;
    line-height: 29px;
    text-align: center;
    font-size: 14px;



  }

  .btn button.active {
    background: #E2C78F;
    color: rgba(255, 255, 255, 1);
    border: none;

  }

  .btn button {
    color: rgba(179, 179, 179, 1);
    border: 1px solid #959595;
    background: none;

  }

  .appealList {
    width: 94%;
    margin: 0 auto;
    overflow: hidden;
  }

  .appealList ul li {
    overflow: hidden;
    background: white;
    padding-top: 12px;
    margin-bottom: 9px;
    padding-bottom: 20px;
    border-radius: 4px;
  }

  .appealList ul li>span {
    display: inline-block;
    background: rgba(246, 234, 212, 1);
    border-radius: 0px 10px 10px 0px;
    padding: 0 14px;
    margin-bottom: 6px;
    font-size: 10px;
    font-family: PingFangSC-Regular;
    color: rgba(187, 159, 97, 1);
    line-height: 20px;
    text-align: center;
    /* width: 0;
    flex-grow: 1; */
    /* margin-right: 140px; */
  }

  .appealList ul li>i {
    font-style: normal;
    font-size: 12px;
    color: rgba(76, 76, 76, 1);
    line-height: 20px;
    float: right;
    margin-right: 10px;
  }

  .appealList ul li .up {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    border-bottom: 1px solid rgba(177, 177, 177, 1);
    padding-bottom: 8px;
    margin-bottom: 14px;
    margin-left: 20px;
    position: relative;
    display: flex;
    line-height: 28px;
    justify-content: space-between;

  }

  .appealList ul li .up .name {
    width: 58%;
    word-break: break-all;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 20px;
    border: none;
    margin-right: 4px;
  }

  .appealList ul li .up .salesman {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 28px;
    margin-left: 4px;
    border: none;
    margin-right: 0;
    padding: 0;
  }


  .appealList ul li .up .upBtn {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    width: 40%;
    position: relative;
    
  }

  .appealList ul li .up .upBtn button {
    display: inline-block;
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
    width: 90%;
    overflow: hidden;
    margin-left: 20px;

  }

  .appealList ul li .down i {
    font-style: normal;
    font-size: 12px;
    color: rgba(242, 111, 83, 1);
  }

  .appealList ul li .down a {
    float: right;
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
  }

  .empty {
    padding-top: 100px;
  }

  .empty img {
    display: block;
    width: 168px;
    height: 154px;
    margin: 0 auto;

  }

  .empty p {
    font-size: 16px;
    color: #b2b2b2;
    text-align: center;
    padding-top: 24px;

  }

</style>
