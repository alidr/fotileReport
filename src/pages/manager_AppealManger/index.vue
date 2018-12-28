<template>
  <!-- 申诉审批 -->
  <div class="appeal">
    <div class="btn">
      <button type="button" :class="{active:style==1}" @click="active(1)">授权审批</button>
      <button type="button" :class="{active:style==2}" @click="active(2)">合同审批</button>
      <button type="button" :class="{active:style==3}" @click="active(3)" v-if="AccessId==1||AccessId==2">续签审批</button>
    </div>
    <div class="flex selectCon">
      <div class="flex justifyCenter select" @click="handleTimeSort">
        <span>申请时间{{isTimeSort==0?'顺序':'逆序'}}</span>
        <i>
          <img src="./timeIcon.png" alt="">
        </i>
      </div>
      <div class="flex justifyCenter select" @click="handleApprovalStatus">
        <span>{{selectStatus}}</span>
        <i>
          <img src="./1.png" alt="" v-if="!isShowList">
          <img src="./2.png" alt="" v-if="isShowList">
        </i>
      </div>
      <div class="maskList" v-if="isShowList">
        <ul class="flex">
          <li :class="{yellow:selectStatus==item.Name}" v-for="item in selectList" :key='item.Status' @click="handleSelectStatus(item)">{{item.Name}}</li>
        </ul>
      </div>
    </div>
    <div class="bgcMask" v-if="isShowList"></div>
    <div class="appealList">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="applyDetail(item.CompanyID)">
          <div class="oneLine">
            <p>
              <span class="lable">{{item.TypeName}}</span>
              <span v-if="item.Status==0" style="color:#C19F57">待审核</span>
              <span v-if="item.Status==1" style="color:#6997C0">通过，合同剩余{{item.EndTime}}天</span>
              <span v-if="item.Status==-1" style="color:#F26F53">不通过，合同剩余{{item.EndTime}}天</span>
            </p>
            <i>提交日期 {{item.Date}}</i>
          </div>
          <div class="up">
            <p class="name">{{item.CompanyName}} </p>
            <!-- <b class="salesman">业务员{{item.UserName}}</b> -->
            <div class="upBtn" v-if="item.Status == 0">
              <button type="button" class="no" @click.stop="noAllow(true,item.ID)">不通过</button>
              <button type="button" class="yes" @click.stop="isAllow(true,item.ID)">审批通过</button>
            </div>
          </div>
          <div class="down">
            <a href="javascript:;" style="border-bottom:1px solid #ccc;padding:3px 0;" v-if="data.TypeID" @click.stop="lookReDetali(item)">点击查看申请详情</a>
            <i @click.stop="showListMask(true,item.CompanyID)" v-if="!data.TypeID">查看相似公司</i>
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
        ID:'',
        data:{},
        isShowList:false,
        isTimeSort:1,
        TypeID:1,
        selectList:[
          {
            Status:1,
            Name:'已审批'
          },
          {
            Status:0,
            Name:'未审批'
          }
        ],
        selectStatus:'未审批',
        Status:0
      }
    },
    beforeCreate () {
      document.querySelector('body').setAttribute('style', 'background-color:#fff')
    },
    beforeDestroy () {
      document.querySelector('body').removeAttribute('style')
    },
    computed: {
      ...mapGetters([
        'AccessId'
      ])
    },
    components:{
      empty
    },
    created() {
      this.getList(1)
    },
    methods: {
      lookReDetali(item){
        this.$router.push({path:'/renewalDetail',query:{reId:item.RenewID,companyId:item.CompanyID}})
      },
      handleSelectStatus(item) {
        this.getList(this.TypeID,item.Status)
        this.isShowList = false
        this.selectStatus = item.Name
        this.Status = item.Status
      },
      handleTimeSort(){
        this.isTimeSort = this.isTimeSort == 0 ? 1 :0
        this.getList(this.TypeID,this.Status)
      },
      handleApprovalStatus() {
        this.isShowList = !this.isShowList
      },
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
      getList(TypeID,Status = 0) {
        this.TypeID = TypeID
        let url = ''
        let params = {}
        if (TypeID==1 || TypeID==2) {
          url = this.getHost() + '/Approval/GetFollowList'
          params = {
            UserId: getCookie('UserId'),
            token: getCookie('token'),
            TypeID: TypeID,
            IsSort: this.isTimeSort,
            Status: Status
          }
        } else if(TypeID==3){
          url = this.getHost() + '/Approval/RenewFollowList'
          params = {
            UserId: getCookie('UserId'),
            token: getCookie('token'),
            IsSort: this.isTimeSort,
            Status: Status
          }
        }
        this.axiosloading()
        axios({
            url: url,
            method: 'post',
            data: qs.stringify(params)
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              if (TypeID==3) {
                res.data.Data['TypeID'] = 3
              }
              this.list = res.data.Data.list
              this.data = res.data.Data
              console.log(this.data,'data');
              
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
        this.isTimeSort = 1
        this.selectStatus = '未审批'
        this.Status = 0
        this.getList(style)
      },
      isAllow(bool, id) {
        if (!bool) {
          if (!this.giveUpReason) {
            this.getToast("请输入不通过得原因",'warn')
            return
          }
          let NoAgreeUrl = ''
          if (this.TypeID==3) {
            NoAgreeUrl =  this.getHost() + '/Approval/CancelRenewFollow'
          }else{
            NoAgreeUrl = this.getHost() + '/Approval/CancelFollow'
          }
          this.axiosloading()
           axios({
            url: NoAgreeUrl,
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
          let agreeUrl = ''
          if (this.TypeID==3) {
            agreeUrl =  this.getHost() + '/Approval/AgreeRenewFollow'
          }else{
            agreeUrl = this.getHost() + '/Approval/AgreeFollow'
          }
           axios({
            url: agreeUrl,
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
  .flex{
    display: flex;
    align-items: center;
  }
  .justifyCenter{
    justify-content: center;
  }
  .select{
    flex: 1;
  }
  .select img{
    width: 9px;
    margin-left: 5px;
  }
  .selectCon{
    background-color: #fff;
    border-top:1px solid #F5F5F5;
    border-bottom: 1px solid #F5F5F5; 
    position: relative;
    height: 45px;
  }
  .maskList{
    position: absolute;
    top: 46px;
    left: 0;
    width: 100%;
    z-index: 5;
  }
  .maskList .yellow{
    color: #E2C78F;
  }
  .maskList ul{
    background-color: #fff;
    flex-direction: column;
    width: 100%;
  }
  .maskList ul li{
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #F5F5F5;
    padding-left: 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .maskList ul li:last-child{
    border-bottom: none;
  }
  .bgcMask{
    width: 100%;
    min-height:calc(100vh - 150px);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    background-color: rgba(0,0,0,.4);
  }
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
    /* width: 58%; */
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 16px 0;
    background-color: #fff;
  }

  .btn button {
    display: black;
    height: 29px;
    border-radius: 4px;
    padding: 0 22px;
    line-height: 29px;
    text-align: center;
    font-size: 14px;
    margin-right: 10px;
  }

  .btn button.active {
    background: #E2C78F;
    color: rgba(255, 255, 255, 1);
    border: none;

  }

  .btn button {
    color: #B3B3B3;
    border: 1px solid #B3B3B3;
    background: none;

  }

  .appealList {
    padding: 15px;
  }

  .appealList ul li {
    overflow: hidden;
    background: white;
    padding-top: 12px;
    margin-bottom: 9px;
    padding-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 0px 15px rgba(125, 125, 125, 0.19);
  }
  .appealList ul li .oneLine{
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .appealList ul li .oneLine .lable {
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
  .appealList ul li .oneLine span{
    font-size: 10px;
  }

  .appealList ul li .oneLine>i {
    font-style: normal;
    font-size: 12px;
    color: rgba(76, 76, 76, 1);
    line-height: 20px;
    float: right;
    margin-right: 10px;
  }

  .appealList ul li .up {
    width: 92%;
    margin: 0 auto;
    border-bottom: 1px solid #F5F5F5;
    padding: 15px 0;
    margin-bottom: 14px;
    margin-left: 15px;
    position: relative;
    display: flex;
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
    width: 44%;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .appealList ul li .down i {
    font-style: normal;
    font-size: 12px;
    color: rgba(242, 111, 83, 1);
  }

  .appealList ul li .down a {
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
