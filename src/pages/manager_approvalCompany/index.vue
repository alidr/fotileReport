<template>
  <!-- 公司待跟进 -->
  <div class="CompanyFollow">
    <div class="top companyTop">
      <div class="search">
        <input type="text" placeholder="请搜索公司名称关键词" v-model="keyword">
        <span @click="getList">搜索</span>
      </div>
      <div class="FilterConditions ">
        <div class="filter">
          <span class="filterResult">{{statusSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(0)"></span>
        </div>
        <i></i>
        <div class="filter">
          <span class="filterResult">{{styleSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(1)"></span>
        </div>
        <i></i>
        <div class="filter">
          <span class="filterResult">{{personSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(2)"></span>
        </div>
      </div>
      <ul class="selectListStatus" v-show="hasMask[0]">
        <li v-for="(item,index) in Status" :key="index" :class="{active:index==statusHasActive}" @click="statusListActive(index,item.Name,item.ID)">{{item.Name}}</li>
        <div class="mask"></div>
      </ul>
      <ul class="selectListStyle" v-show="hasMask[1]">
        <li v-for="(item,index) in Style" :key="index" :class="{active:index==styleHasActive}" @click="styleListActive(index,item.Name,item.ID)">{{item.Name}}</li>
        <div class="mask"></div>
      </ul>
      <ul class="selectListPerson" v-show="hasMask[2]">
        <li v-for="(item,index) in Person" :key="index" :class="{active:index==personHasActive}" @click="personListActive(index,item.Name,item.ID)">{{item.Name}}</li>
        <div class="mask"></div>
      </ul>
    </div>
    <div class="companyList">
      <ul>
        <li v-for="(item,index) in list" :key="index">
          <a href="javascript:;">
            <div class="listMid">
              <span :class="{active:checkBoxs[index]}" @click="check(index,item.ID)"></span>
              <button type="button" :class="{red:item.Status==2,yellow:item.Status==1,grey:item.Status==3}">{{item.StatusName}}</button>
              <p>{{item.Name}}</p>
            </div>
            <div class="listBottom">
              <i @click="showListMask(true,item.ID)">查看相似公司</i>
              <p>{{item.UserName}}于{{item.CreateDate}}新建</p>
            </div>
          </a>

        </li>
      </ul>
      <empty v-if='emptyFlag'></empty>
    </div> 

      <footer>
        <span :class="{active:checkAllBox}" @click="checkAll(list)"></span>
        <p>已选
          <b>{{idList.length}}</b>个家装公司</p>
          <div class="footerBtn">
        <button type="button" @click="noAllow(true)" class="noAllow">不通过</button>
        <button type="button" @click="distribution">审批通过</button>
      </div>

      </footer>

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
      <empty v-if="nullFlag"></empty>
    </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  import {
    mapGetters,
    mapMutations
  } from 'vuex';
   import empty from "../../components/empty"
  export default {
    name: 'CompanyFollow',
    data() {
      return {
        list: [],
        emptyFlag:false,
        checkBoxs: [],
        checkAllBox: false,
        idList: [],
        isShowMask: false,
        giveUp: false,
        giveUpReason: '',
        similadList: '',
        listmask: false,
        nullFlag: false,
        listFlag: true,
        // 经销商列表
        Status: [],
        // 业务员列表
        Style: [],
        // 时间排序
        Person: [{
          ID: false,
          Name: '最新申诉'
        }, {
          ID: true,
          Name: '申请时间顺序'
        }],
        hasMask: [false, false, false],
        // hasStatusMask:false,
        // hasStyleMask:false,
        // hasPersonMask:false,
        statusHasActive: 0,
        statusSelect: "全部经销商",
        personHasActive: 0,
        personSelect: "最新申诉",
        styleHasActive: 0,
        styleSelect: "全部业务员",
        keyword:''

      }
    },
    created() {
      localStorage.removeItem("CompanyID")
      this.getDealer()
      this.getBusniess()
      this.getList()

    },
    components:{
      empty
    },
    methods: {
      getBusniess(){
        axios({
            url: this.getHost() + '/Approval/GetUserList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id:''
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.Style = res.data.Data.list
              this.Style.unshift({
                  ID: '',
                  Name: '全部业务员'
              })
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
      getDealer(){
        axios({
            url: this.getHost() + '/Approval/GetDealerList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.Status = res.data.Data.list
              this.Status.unshift({
                  ID: '',
                  Name: '全部经销商'
              })
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
       maskStatus(index) {
        if (this.hasMask[index] == true) {
          this.hasMask[index] = false
          // console.log(this.hasMask[index]);
          
        } else {
          this.hasMask=[false,false,false]
          this.hasMask[index] = true

        }
        this.hasMask = this.hasMask.slice()
        this.Mask = this.hasMask[index] ? true : false
      },
      statusListActive(index, name,id) {
        this.statusHasActive = index
        this.statusSelect = name
        this.hasMask[0] = false
        this.StatusID = id
        this.getList()
      
      },
      styleListActive(index, name,id) {
        this.styleHasActive = index
        this.styleSelect = name
        this.hasMask[1] = false
        this.TypeID=id
        this.getList()
             
      },
      personListActive(index, name,id) {
        this.personHasActive = index
        this.personSelect = name
        this.hasMask[2] = false
        this.SaleID=id
        this.getList()
      },
      showListMask(bool, id) {
        this.listmask = bool
        if (bool) {
          this.getSimilarList(id)
        }
      },
      getSimilarList(id) {
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
            if (res.data.Status === 1) {
              this.similadList = res.data.Data
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
      giveUpFollow() {
        if (!this.giveUpReason) {
          this.getToast("请输入审核理由", 'warn')
        } else {
          axios({
              url: this.getHost() + '/Approval/AuditCompany',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                List: this.idList,
                IsAgree: false,
                AuditReason: this.giveUpReason
              })
            })
            .then(res => {
              if (res.data.Status === 1) {
                this.getToast("审批成功", 'correct')
                this.getList()
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
      noAllow(bool) {
        if (this.idList.length == 0) {
          this.getToast("请选择要审核的公司", 'warn')
          return
        } else {

          this.isShowMask = bool
        }

      },
      getList() {
        axios({
            url: this.getHost() + '/Approval/GetAuditCompanyList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              DealerID: this.StatusID,
              SaleID: this.TypeID,
              Sort:this.SaleID,
              Keyword: this.keyword
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.list = res.data.Data.list
              if (this.list.length==0) {
                this.nullFlag = true
              } else {
                this.nullFlag = false
              }
              for (let i = 0; i < this.list.length; i++) {
                this.checkBoxs.push(false)

              }

            } else if (res.data.Status < 0) {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      check(index, id) {
        if (this.checkBoxs[index]) {
          this.checkBoxs[index] = false
          this.checkAllBox = false
          for (let i = 0; i < this.idList.length; i++) {
            if (this.idList[i] == id) {
              this.idList.splice(i,1)
            }
          }

          for (let i = 0; i < this.checkBoxs.length; i++) {
            if (this.checkBoxs[i]) {
              this.checkAllBox = true
            }
          }

        } else {
          this.checkBoxs[index] = true
          this.idList.push(id)
          this.checkAllBox = true
        }

        this.idList = this.idList.slice()
        this.checkBoxs = this.checkBoxs.slice()


      },
      checkAll(list) {

        if (this.checkAllBox) {
          this.checkAllBox = false
          this.idList = this.idList.splice()
          for (let i = 0; i < list.length; i++) {
            this.checkBoxs[i] = false
          }
          this.checkBoxs = this.checkBoxs.slice()
        } else {

          this.checkAllBox = true
          for (let i = 0; i < list.length; i++) {
            this.checkBoxs[i] = true
            this.idList.push(list[i].ID)
          }
          this.checkBoxs = this.checkBoxs.slice()
          this.idList = this.idList.slice()
        }

      },
      distribution() {
        if (this.idList.length == 0) {
          this.getToast("请选择要审核的公司", 'warn')
        } else {
          axios({
              url: this.getHost() + '/Approval/AuditCompany',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
                List: this.idList,
                IsAgree: true,
                AuditReason: ''
              })
            })
            .then(res => {
              if (res.data.Status === 1) {
                this.getToast("审批成功", 'correct')
                this.getList()
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
      ...mapMutations({
        setAccessId: 'SET_ACCESSID'
      })
    }
  }

</script>

<style scoped>
  @import '../../common/mask.css';
  @import '../../common/filter.css';
  .FilterConditions{
    padding: 0 15px;
  }
  .maskContain ul {
    margin-bottom: 22px;
  }

  .maskContain li {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 8px 0;
    font-size: 12px;
  }

  .maskContain li:last-child {
    border-bottom: none;
  }
.footerBtn{
  position: absolute;
  right: 0;
}
  .name {
    width: 0;
    flex-grow: 1;
  }

  .CompanyFollow {
    width: 100%;
    overflow: hidden;
  }

  .top {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 20px;
    background: white;
    padding-bottom: 16px;
    margin-bottom: 12px;
  }

  .top .search {
    width: 92%;
    height: 44px;
    margin: 0 auto;
    position: relative;

  }

  .top .search input {
    width: 80%;
    height: 96%;
    border: none;
    background: none;
    padding-left: 14px;
    border: 1px solid rgba(208, 208, 208, 1);
    border-radius: 4px;

  }

  .top .search span {
    display: block;
    width: 18%;
    height: 44px;
    background: rgba(182, 160, 121, 1);
    border-radius: 0px 4px 4px 0px;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 44px;
    text-align: center;
  }

  .top .classList {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 22px;
    display: flex;
    justify-content: space-between;
  }

  .top .classList .filter {
    margin-right: 0;
    width: 30%;
    flex: none;
  }


  .companyList {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    padding-bottom: 50px;
  }

  .companyList ul {
    width: 100%;
    overflow: hidden;
  }

  .companyList ul li {
    width: 100%;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .companyList ul li a {
    display: block;
    width: 100%;
    overflow: hidden;

  }

  .companyList ul li a .listTop {
    width: 100%;
    overflow: hidden;
  }

  .companyList ul li a .listTop span {
    display: block;
    width: 26px;
    height: 24px;
    background: rgba(242, 111, 83, 1);
    border-radius: 6px 0;
    float: left;
    position: relative;

  }

  .companyList ul li a .listTop span img {
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

  .companyList ul li a .listTop b {
    float: right;
    font-size: 12px;
    color: rgba(242, 111, 83, 1);
    font-weight: normal;
    padding-top: 10px;
    margin-right: 4px;
  }

  .companyList ul li a .listMid {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    width: 88%;
    padding-top: 16px;
    margin: 0 auto;
    padding-bottom: 14px;
    border-bottom: 1px solid #F0F0F0;
    /* margin-bottom: 12px; */
  }

  .companyList ul li a .listMid span {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #ccc;
    position: relative;
    margin-right: 14px;
    margin-top: 0;
    margin-bottom: 0;
    margin: auto 0;
  }

  .companyList ul li a .listMid span.active {
    border: 1px solid rgba(226, 199, 143, 1);
  }

  .companyList ul li a .listMid span.active::before {
    background: rgba(226, 199, 143, 1);
  }

  .companyList ul li a .listMid span::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #ccc;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;


  }

  .companyList ul li a .listMid button {
    display: block;
    height: 20px;
    /* background: rgba(207, 207, 207, 1); */
    border-radius: 3px;
    font-size: 10px;
    font-family: PingFangSC-Regular;
    /* color: rgba(255, 255, 255, 1); */
    line-height: 20px;
    text-align: center;
    margin-right: 12px;
    padding: 0 12px;

    margin-top: 0;
    margin-bottom: 0;
    margin: auto 0;
  }

  .companyList ul li a .listMid p {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    width: 60%;
    word-break: break-all;
  }

  .companyList ul li a .listBottom {
    display: flex;
    width: 88%;
    overflow: hidden;
    margin: 0 auto;
    padding: 10px 0;
  }

  .companyList ul li a .listBottom i {
    font-size: 10px;
    color: rgb(230, 76, 16);
    font-style: normal;
    margin-right: 16px;
  }

  .companyList ul li a .listBottom p {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
  }

  .companyList ul li a .listBottom b {
    float: right;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    margin-right: 15px;
  }

  footer {
    width: 100%;
    height: 55px;
    background: #636770;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
  }

  footer span {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-left: 6px;
    border: 1px solid #ccc;
    position: relative;
    margin-top: 19px;
    margin-left: 38px;
  }

  footer span.active {
    border: 1px solid rgba(226, 199, 143, 1);
  }

  footer span.active::before {
    background: rgba(226, 199, 143, 1);
  }

  footer span::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    background: #ccc;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;


  }

  footer p {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 55px;
    padding-left: 12px;
  }

  footer button {
    height: 33px;
    border-radius: 4px;
    background: #E2C78F;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 33px;
    text-align: center;
    margin-top: 10px;
    padding: 0 8px;
    margin-right: 8px;
  }

  footer .noAllow {
    background-color: #f0f0f0;
    color: #ccc;
    margin-left: 24px;
  }

  .close {
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

  .null {
    padding-top: 100px;
  }

  .null img {
    display: block;
    width: 168px;
    height: 154px;
    margin: 0 auto;

  }

  .null p {
    font-size: 16px;
    color: #b2b2b2;
    text-align: center;
    padding-top: 24px;

  }
  .red{
  background-color: #FBC1B4;
  color: #F26F53
}
.yellow{
  background-color: #F6EAD4;
  color: #BB9F61;
}
.grey{
  background-color: #ccc;
  color: #fff
}
</style>
