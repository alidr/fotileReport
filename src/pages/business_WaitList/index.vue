<template>
  <!-- 等待列表 -->
  <div id="waitList">
    <div class="waitInfo">
      {{ShopCount}}家商户排队中，{{RobShop}}家可进行抢单
    </div>
    <div class="cantain">
      <div class="waitList" v-for="(item,index) in companyList" :key="index">
        <div class="firstLine">
          <span class="status" :class="{red:item.Status==2,yellow:item.Status==1,grey:item.Status==3}">{{item.StatusName}}</span>
          <!-- <span class="status" v-if="item.Status == 1">已完成</span> -->
          <span class="name">{{item.Name}}</span>
          <p class="waitNum" v-if="(item.Surplus < item.Enddate)||(item.Surplus > item.Enddate)&&!item.IsShow">
            <span>当前位置 {{item.SerialNum}}/{{item.Count}}</span>
          </p>
          <p class="waitend" v-if="(item.Surplus > item.Enddate)&&item.IsShow">
            <span @click="Mask(true,item.ID)">放弃</span>
            <span @click="grab(item.ID,item.CompanyID)">抢单</span>
          </p>
          <i>{{index+1}}</i>
        </div>
        <div class="TwoLine">
          <span>保护期 {{item.Surplus}}/{{item.Enddate}}</span>
          <span v-if='(item.Surplus > item.Enddate)&&!flagPerson'>抢单人：{{item.UserName}}</span>
          <span v-if='(item.Surplus > item.Enddate)&&!flagTime'>抢单时间：{{item.GrabTime}}h</span>
        </div>
      </div>

    </div>
    <!-- 抢单成功这招遮罩 -->
    <div id="mask" v-if="hasPsdMask">
      <div class="maskContain">
        <p style="margin-bottom:30px">恭喜你抢单成功，请尽快跟进哦！</p>
        <!-- <p style="margin-bottom:20px" v-if="choice=='0'">已放弃</p> -->
        <a style="margin-bottom:10px" href="javascript:;" class="cancel" @click="reload">刷新页面</a>
      </div>
    </div>
    <!-- 抢单放弃这招遮罩 -->
    <div id="mask" v-if="hasMask">
      <div class="maskContain">
        <p style="margin-bottom:20px" class="title">你确定要放弃吗？</p>
        <div class="btn">
          <a style="margin-bottom:10px" href="javascript:;" class="cancel" @click="Mask(false)">取消</a>
          <a style="margin-bottom:10px" href="javascript:;" class="confirm" @click="giveUp(ID)">确定</a>
        </div>
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
    name: 'waitList',
    data() {
      return {
        hasMask: false,
        hasPsdMask: false,
        RobShop: 0,
        ShopCount: 0,
        ID: '',
        choice: '1', // 1表示抢单  0表示放弃
        flagPerson: false,
        flagTime: false,
        companyList: [
          //   {
          //   id: 1,
          //   Status: 1,
          //   Name: '公司1',
          //   CompanyID: 1,
          //   SateID: '1',
          //   Result: '',
          //   Enddate: 12,
          //   Surplus: 20,
          //   lineNum: 2
          // },{
          //   id: 2,
          //   Status: 1,
          //   Name: '公司1',
          //   CompanyID: 1,
          //   SateID: '1',
          //   Result: '',
          //   Enddate: 20,
          //   Surplus: 11,
          //   lineNum: 2
          // },{
          //    id: 3,
          //   Status: 1,
          //   Name: '公司1',
          //   CompanyID: 1,
          //   SateID: '1',
          //   Result: '',
          //   Enddate: 9,
          //   Surplus: 12,
          //   lineNum: 2
          // },{
          //   id: 3,
          //   Status: 1,
          //   Name: '公司1',
          //   CompanyID: 1,
          //   SateID: '1',
          //   Result: '',
          //   Enddate: 33,
          //   Surplus: 6,
          //   lineNum: 2
          // },{
          //   id: 4,
          //   Status: 1,
          //   Name: '公司1',
          //   CompanyID: 1,
          //   SateID: '1',
          //   Result: '',
          //   Enddate: 20,
          //   Surplus: 5,
          //   lineNum: 2
          // }
        ],
      }
    },
    created() {

    },
    mounted() {
      this.getData();
    },
    methods: {
      // 弹框

      PsdMask(bool) {
        this.hasPsdMask = bool
      },
      Mask(bool, id) {
        this.hasMask = bool
        this.ID = id
      },
      reload() {
        this.PsdMask(false);
        this.getData(); // 点击刷新后重新获取页面
      },
      // 放弃
      giveUp(id) {
        axios({
            url: this.getHost() + '/Notice/Renounce',
            method: 'post',
            data: qs.stringify({
              // 拿到用户id和token
              ID: id,
              UserId: getCookie('UserId'),
              token: getCookie('token'),

            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.Mask(false)
              setTimeout(() => {
                this.$router.push({
                  path: '/home'
                })
              }, 2000);
              // this.getData ()
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
      // 抢单
      grab(id, CompanyID) {
        axios({
            url: this.getHost() + '/Notice/Robbing',
            method: 'post',
            data: qs.stringify({

              ID: id,
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              CompanyID: CompanyID
            })
          })
          .then(res => {

            if (res.data.Status === 1) {
              this.PsdMask(true);
              setTimeout(() => {
                this.$router.push({
                  path: '/home'
                })
              }, 2000);
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
      // 
      // 等待列表
      getData() {
        axios({
            url: this.getHost() + '/Notice/WaitList',
            method: 'post',
            data: qs.stringify({
              // 拿到用户id和token
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {

            if (res.data.Status === 1) {
              console.log(res)
              this.companyList = res.data.Data.list;
              this.ShopCount = res.data.Data.ShopCount
              this.RobShop = res.data.Data.RobShop
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
    }
  }

</script>

<style scoped>
  @import '../../common/mask.css';
  .waitInfo {
    width: 100%;
    height: 35px;
    background: rgba(255, 245, 231, 1);
    color: #D3B488;
    display: flex;
    align-items: center;
    padding-left: 15px;
    box-sizing: border-box;
  }

  .cantain {
    padding: 15px;
    box-sizing: border-box;
  }

  .waitList {
    background-color: #fff;
    border-radius: 6px;
    padding: 25px 20px 20px 20px;
    position: relative;
    margin-bottom: 10px;
  }

  .firstLine {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;

  }

  .status,
  .waitNum,
  .TwoLine,
  .waitend {
    font-size: 12px;
  }

  .status {
    padding: 5px 10px;
    background-color: #F6EAD4;
    color: #BB9F61;
    border-radius: 4px;
    margin-right: 10px;
  }

  .name {
    width: 0;
    flex: 1;
    font-size: 16px;
    line-height: 20px;
    word-break: break-all;
  }

 

  .waitNum {
    color: #E2C78F;
    border: 1px solid #E2C78F;
    padding: 5px;
    height: 28px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }

  .firstLine i {
    position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    background: #D4A667;
    border-radius: 6px 3px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .waitend {
    display: flex;
  }

  .waitend span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    width: 50px;
    height: 28px;
  }

  .waitend span:first-child {
    background-color: #E4E4E4;
    color: #b2b2b2;
  }

  .waitend span:nth-child(2) {
    background-color: #F26F53;
    color: #fff;
    margin-left: 10px;
  }

  .TwoLine {
    display: flex;
    margin-top: 10px;
    color: #666666;
    justify-content: space-between;
  }

  .red {
    background-color: #FBC1B4;
    color: #F26F53
  }

  .yellow {
    background-color: #F6EAD4;
    color: #BB9F61;
  }

  .grey {
    background-color: #ccc;
    color: #fff
  }

</style>
