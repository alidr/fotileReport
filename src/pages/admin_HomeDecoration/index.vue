<template>
  <!-- 家装公司管理 -->
  <div class="HomeDecoration companyTop" :class="{active:Mask}">
    <!-- 上部 -->
    <div class="top">
      <div class="topBtn">
        <button type="button">洽谈中
          <span>{{count.Negotiation}}</span>
        </button>
        <button type="button">签约中
          <span>{{count.Progressive}}</span>
        </button>
        <button type="button">已签约
          <span>{{count.Complete}}</span>
        </button>
      </div>
      <div class="search">
        <input type="text" placeholder="请搜索公司名称关键词" v-model="keyword">
        <span @click="getList(1)">搜索</span>
      </div>
      <div class="FilterConditions ">
        <div class="filter" @click="maskStatus(0)" v-if='postShow'>
          <div>
          <span class="filterResult" :class="{active:hasMask[0]}">{{salesNum!=0?salesText:statusSelect}}</span>
          <span v-if='salesNum!=0' :class="{active:hasMask[0]}">({{salesNum}})</span>
          <img src="./2.png" class="icon" alt="" v-if='hasMask[0]' >
          <img src="./1.png" class="icon" alt="" v-else>
        </div>
        </div>
        <i v-if='postShow'></i>
        <div class="filter" @click="maskStatus(2)">
          <div>
          <span class="filterResult" :class="{active:hasMask[2]}">{{personSelect}}</span>
          <span v-if='moreNum!=0' :class="{active:hasMask[2]}">({{moreNum}})</span>
          <img src="./2.png" class="icon" alt="" v-if='hasMask[2]' >
          <img src="./1.png" class="icon" alt="" v-else>
        </div>
        </div>
      </div>
      <div class="mask" v-show="hasMask[0]"></div>
      <div class="mask" v-show="hasMask[2]"></div>
      <div class="allMask">
        <!-- 经销商列表 -->
        <div class="allListMask" v-show="hasMask[0]">
          <div>
            <ul class="selectListStatus" :class='{widthUL:salesMask}' v-show='showDistrib'>
              <li :class="{active:distribFlag}" @click='allDistrib()'>全部经销商</li>
              <li v-for="(item,index) in Status" :key="index" :class="{active:index==statusHasActive}" @click="statusListActive(index,item.Name,item.ID)">{{item.Name}}</li>
            </ul>
            <!-- 业务员列表 -->
            <div class="scroll-list-wrap saleWarp" v-show="salesMask">
              <cube-scroll ref="scrollSale" :data="salesmanLists" :options="saleOptions">
                <ul class="salesmanLists" :class='{salesWidth:!showDistrib}'>
                  <li :class="{active:salesmanFlag}" @click.stop='allSalesman()'>全部业务员</li>
                  <li v-for="(item,index) in salesmanLists" :key='index' :dataZM='item.ZM' ref='zmRef'>
                    <span>{{item.Name}}</span>
                    <div class="checkIcon" @click='checkSales(item)'>
                      <i class="emptyBox" :class="{emptyBox:true,checkBoxIcon:isFoodActive.indexOf(item.ID)>-1}"></i>
                    </div>
                  </li>
                </ul>
              </cube-scroll>
             
            </div>
          </div>
          <div class="stateBtn">
            <button type="button" class="gray" @click='resetSales()'>重 置</button>
            <button type="button" class="yellow" @click='sureSales()'>确 认</button>
          </div>
        </div>
        <!-- 高级筛选 -->
        <div class="stateContent" v-show="hasMask[2]">
          <div class="stateUl">
            <!-- 全部状态 -->
            <h3>全部状态</h3>
            <ul class="allState">
              <li :class='{active:allStatus}' @click='checkAllStatus()'>全部</li>
              <li v-for="(item,index) in allStateText" :key="index" :class="{active:isStatus.indexOf(item.ID)>-1}"
                @click="stateCheck(item)">{{item.Name}}</li>
            </ul>
            <!-- 公司分类 -->
            <h3>公司分类</h3>
            <ul class="companyList">
              <li :class='{active:allClassify}' @click='checkClassify()'>公司分类</li>
              <li v-for="(item,index) in Style" :key="index" :class="{active:isStyle.indexOf(item.ID)>-1}" @click="companyCheck(item)">{{item.Name}}</li>
            </ul>
          </div>
          <div class="stateBtn">
            <button type="button" class="gray" @click='resetState(allStateText)'>重 置</button>
            <button type="button" class="yellow" @click='sureState()'>确 认</button>
          </div>
        </div>
      </div>
      <div class="letterSort" v-if="salesMask&&hasMask[0]&&sortArr.length>0">
          <p v-for='item in sortArr' @click='namePosition(item)'>{{item}}</p>
        </div>
    </div>
    <div class="listWrap">
      <div class="scroll-list-wrap">
        <cube-scroll ref="scroll" :data="List" :options="options" @pulling-up="onPullingUp">
          <!-- 公司列表 -->
          <div class="comList">
            <focusList :list="List" id="list" v-if="!admin" :Action="active"></focusList>
            <empty v-if='emptyFlag'></empty>
            <div>
              <div class="contentList" v-for="(item,index) in List" :key="index" v-if="admin" @click="jump(item.ID)">
                <div class="contentListTop">
                  <p class="firstLine">
                    <span :class="{red:item.Status==2,yellow:item.Status==1,grey:item.Status==3}">{{item.StatusName}}</span>
                    <span v-if="item.Status!=3">剩余保护期:{{item.EndDate}}天</span>
                    <span v-if="item.Status==3">合同剩余时间:{{item.EndTime}}天</span>
                  </p>
                  <p class="twoLine">
                    <a href="javascript:;" class="round" :class="{'active':checkBoxs[index]}" @click.stop="check(index,item.ID)"><b
                        :class="{'active':checkBoxs[index]}"></b></a>
                    <a href="javascript:;" class="name">{{item.Name}}</a>
                  </p>
                  <i v-if="item.IsEmphasis"></i>
                </div>
                <div class="contentListBottom">
                  <span>{{item.CreateDate}}</span>
                  <span>{{item.Content}}</span>
                  <span>{{item.UserName}}</span>
                </div>
              </div>
            </div>
          </div>
        </cube-scroll>
      </div>
    </div>

    <div class="bottom" v-if="admin">
      <span class="round" :class="{active:checkAllBox}" @click="checkAll(List)"><b :class="{active:checkAllBox}"></b></span>
      <span class="content">已选择{{idList.length}}个家装公司</span>
      <span class="btn" @click="distribution">分配业务员</span>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  import focusList from "../../components/focusList";
  import companyFilter from '../../components/companyFilter';
  import empty from "../../components/empty"
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: 'HomeDecoration',
    data() {
      return {
        sortArr: [], //字母排序
        postShow: true, //岗位筛选显示隐藏
        moreNum: 0, //高级筛选数量现实
        salesNum: 0, //岗位筛选业务员数量显示
        salesmanFlag: true, //全部业务员
        distribFlag: true, //全部经销商
        allClassify: true, //全部公司分类
        allStatus: true, //全部公司状态
        isStyle: [],
        isStatus: [],
        salesArr: [],
        isFoodActive: [],
        salesMask: false, //业务员列表
        // 全部分类
        allStateText: [{
          ID: 1,
          Name: '洽谈中',
          check: false,
        }, {
          ID: 2,
          Name: '签约中',
          check: false,
        }, {
          ID: 3,
          Name: '已签约',
          check: false,
        }],
        pageCount: 1,
        page: 1,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
        admin: false,
        keyword: '',
        StatusID: '',
        TypeID: '',
        SaleID: '',
        count: {
          Negotiation: '',
          Progressive: '',
          Complete: ''
        },
        List: [1, 1, 1, 1],
        emptyFlag: false,
        Mask: false,
        // 公司状态列表
        salesmanLists: [],
        Status: [], //经销商
        // 公司类型列表
        Style: [],
        // 业务员
        Person: [],
        hasMask: [false, false, false],
        statusHasActive: 0,
        statusSelect: "岗位",
        personHasActive: 0,
        personSelect: "高级筛选",
        styleHasActive: 0,
        checkBoxs: [],
        checkAllBox: false,
        idList: [],
        active: false,
        allStateActive: false,
        checkFlag: false,
        SaleID: '', //业务员ID
        DealerID: '', //经销商ID
        flag: false,
        showDistrib: true, //经销商显示隐藏
        topHight: 0,
        zmArr: [],
        nameData: [],
        salesText:'业务员'


      }

    },
    computed: {
      options() {
        return {
          pullUpLoad: this.pullUpLoadObj,
          scrollbar: true,
        }
      },
      saleOptions() {
        return {
          pullingDown: false,
          beforePulldown: true,
          isPullingDown: false,
          pulldown: false,
          pullup: false
        }
      },
      pullUpLoadObj: function () {
        return {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {
            more: this.pullUpLoadMoreTxt,
            noMore: this.pullUpLoadNoMoreTxt
          }
        }
      },
      ...mapGetters([
        'AccessId'
      ])
    },
    components: {
      focusList,
      empty,
      companyFilter
    },
    created() {

      this.getStyleList()
      this.getPersonList()
      this.getList()
      this.getTotalData()
      this.statusHasActive = -1
      if (this.AccessId == -1 || this.AccessId == 4) {
        this.admin = true
      }
      if (this.AccessId == 5) {
        this.postShow = false
        this.active = true
      }
    },
    // mounted(){
    //   this.getPersonList()
    // },
    methods: {
      onPullingUp() {
        // 更新数据
        if (this.pageCount >= this.page) {
          this.getList(this.page)
        } else {
          this.$refs.scroll.forceUpdate()
        }
      },
      distribution() {
        if (this.idList.length == 0) {
          this.getToast("请选择要分配的公司", 'warn')
        } else {
          localStorage.setItem("CompanyID", JSON.stringify(this.idList))
          this.$router.push({
            path: '/SalesmanList',
            query: {
              style: 1
            }
          })
        }
      },
      check(index, id) {
        if (this.checkBoxs[index]) {
          this.checkBoxs[index] = false
          this.checkAllBox = false
          for (let i = 0; i < this.idList.length; i++) {
            if (this.idList[i] == id) {
              this.idList.splice(i)
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
      checkAll(List) {
        if (this.checkAllBox) {
          this.checkAllBox = false
          this.idList = this.idList.splice()
          for (let i = 0; i < List.length; i++) {
            this.checkBoxs[i] = false
          }
          this.checkBoxs = this.checkBoxs.slice()
        } else {

          this.checkAllBox = true
          for (let i = 0; i < List.length; i++) {
            this.checkBoxs[i] = true
            this.idList.push(List[i].ID)
          }
          this.checkBoxs = this.checkBoxs.slice()
          this.idList = this.idList.slice()
        }

      },
      jump(num) {
        this.$router.push({
          path: '/companyDetail',
          query: {
            id: num
          }
        })
      },
      getStyleList() {
        this.axiosloading()
        axios({
            url: this.getHost() + '/Notice/CompanyList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.Style = res.data.Data.list
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
      getPersonList() {
        this.axiosloading()
        axios({
            url: this.getHost() + '/Company/SaleList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Keyword: ''
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.salesmanLists = res.data.Data.list
              this.sortArr = res.data.Data.zmlist
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
      getList(page) {
        this.page = page || 1
        this.axiosloading()
        axios({
            url: this.getHost() + '/Company/CompanyList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              keyword: this.keyword,
              StatusID: this.StatusID,
              TypeID: this.TypeID,
              SaleID: this.SaleID,
              DealerID: this.DealerID,
              page: page || 1
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.pageCount = res.data.Data.pageCount
              if (this.page == 1) {
                this.List = res.data.Data.list
              } else {
                if (this.List.length > 0 && this.page > 1) {
                  // 如果有新数据
                  // let newPage = _foods.slice(0, 5)
                  this.List = this.List.concat(res.data.Data.list)
                }
              }
              this.page++
              if (this.List.length == 0) {
                this.emptyFlag = true
              } else {
                this.emptyFlag = false
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
      getTotalData() {
        axios({
            url: this.getHost() + '/Company/Count',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token')
            })
          })
          .then(res => {
            if (res.data.Status === 1) {
              this.count = res.data.Data

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
      maskStatus(index) {
        if (this.hasMask[index] == true) {
          this.hasMask[index] = false
        } else {
          this.hasMask = [false, false, false]
          if (this.AccessId == 4) {
            this.salesMask = true
            this.showDistrib = false
            this.getPersonList()
          }
          this.hasMask[index] = true
          axios({
              url: this.getHost() + '/Company/UserList',
              method: 'post',
              data: qs.stringify({
                UserId: getCookie('UserId'),
                token: getCookie('token'),
              })
            })
            .then(res => {
              if (res.data.Status == 1) {
                this.Status = res.data.Data.list
              }
            })

        }
        this.Mask = this.hasMask[index] ? true : false

      },

      // 经销商点击事件
      // 点击全部经销商
      allDistrib() {
        this.statusSelect='岗位'
        this.distribFlag = true
        this.statusHasActive = -1
        this.salesMask = false
        this.DealerID = ''
      },
      statusListActive(index, name, id, zmlist) {
        this.statusSelect=name
        this.distribFlag = false
        this.isFoodActive = []
        this.salesMask = true
        this.statusHasActive = index
        this.DealerID = id
        var arr = []
        this.Status.forEach((item, index) => {
          arr.push(item.ID)
        })
        var arrIndex = arr.indexOf(this.DealerID)
        this.salesmanLists = this.Status[arrIndex].list
        this.sortArr = this.Status[arrIndex].zmlist
      },
      // 业务员列表重置
      resetSales() {
        this.isFoodActive = []
        this.SaleID = ''
      },
      //选择业务员 
      // 点击所有业务员
      allSalesman() {
        this.salesmanFlag = true
        this.isFoodActive = []
        this.SaleID = ''
      },

      checkSales(item) {
        this.topHight = event.currentTarget.offsetTop
        this.salesmanFlag = false
        let id = item.ID
        let indexId = this.isFoodActive.indexOf(id);
        if (indexId < 0) {
          this.isFoodActive.push(id);
          this.SaleID = this.isFoodActive.join(',')
        } else {
          this.isFoodActive.splice(indexId, 1);
          this.SaleID = this.isFoodActive.join(',')
        }

      },
      //确认业务员
      sureSales() {
        this.page = 1
        this.getList()
        this.maskStatus(0)
        this.salesNum = this.isFoodActive.length
      },
      //点击全部分类
      checkAllStatus() {
        this.allStatus = !this.allStatus
        this.isStatus = []
        this.StatusID = ''
      },
      stateCheck(item) {
        this.allStatus = false
        let id = item.ID
        let indexId = this.isStatus.indexOf(id);
        if (indexId < 0) {
          this.isStatus.push(id);
          this.StatusID = this.isStatus.join(',')
        } else {
          this.isStatus.splice(indexId, 1);
          this.StatusID = this.isStatus.join(',')
        }
      },
      //点击公司分类
      checkClassify() {
        this.allClassify = !this.allClassify
        this.isStyle = []
        this.TypeID = ''
      },
      companyCheck(item) {
        this.allClassify = false
        let id = item.ID
        let indexId = this.isStyle.indexOf(id);
        if (indexId < 0) {
          this.isStyle.push(id);
          this.TypeID = this.isStyle.join(',')
        } else {
          this.isStyle.splice(indexId, 1);
          this.TypeID = this.isStyle.join(',')
        }
      },
      //高级筛选点击重置
      resetState() {
        this.isStyle = []
        this.isStatus = []
        this.TypeID = ''
        this.StatusID = ''
        this.allClassify = true
        this.allStatus = true
      },
      //高级筛选点击确认
      sureState() {
        this.moreNum = this.isStatus.length + this.isStyle.length
        this.page = 1
        this.getList()
        this.maskStatus(2)
      },
      // 首字母定位
      namePosition(item) {
        let newList = this.sortArr.slice(0, this.sortArr.indexOf(item))
        let number = 0
        this.salesmanLists.forEach((el) => {
          if (newList.indexOf(el.ZM) > -1) {
            number++
          }
        })
        this.scrollTo(number)
      },
      scrollTo(number) {
        var liHeight=40//li的高度
        this.$refs.scrollSale.scrollTo(0,this.scrollToY = -((number) * liHeight),
        )
      },
    }
  }

</script>
<style scoped>
  @import '../../common/filterH.css';
  @import '../../common/focusList.css';

  .allMask .saleWarp {
    width: 100%;
    height: 60vh;
    background-color: #F5F5F5;
    overflow-y: scroll !important;
    -webkit-overflow-scrolling: touch;

  }
  .saleWarp .cube-scroll-content{
    z-index: 800 !important;
  }
  .listWrap .scroll-list-wrap {
    height: calc(100vh - 210px);
  }

  .contentListTop {
    margin-left: 0px;
  }

  .contentListBottom {
    margin-left: 0px;
  }

  .firstLine span:nth-child(1) {
    margin-left: 30px;
  }

  .twoLine .round {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-right: 15px;
  }

  .twoLine .round.active {
    border: 1px solid #E2C78F;
  }

  .twoLine .round b {
    display: flex;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: #ccc;
  }

  .twoLine .round b.active {
    background-color: #E2C78F;
  }

  .HomeDecoration {
    width: 100%;
    overflow: hidden;
  }

  .top {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 20px;
    background: white;
    margin-bottom: 12px;
  }

  .top .topBtn {
    width: 92%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #F0F0F0;
    padding-bottom: 14px;
    margin: 0 auto;
    margin-bottom: 12px;
  }

  .top .topBtn button {
    width: 29%;
    height: 38px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 38px;
    text-align: center;
  }

  .top .topBtn button:nth-child(1) {
    width: 29%;
    height: 38px;
    background: rgba(246, 234, 212, 1);
    border-radius: 6px;
    font-size: 14px;
    color: rgba(187, 159, 97, 1);
    line-height: 38px;
    text-align: center;
  }

  .top .topBtn button:nth-child(2) {
    width: 29%;
    height: 38px;
    background: rgba(251, 193, 180, 1);
    border-radius: 6px;
    font-size: 14px;
    color: #F26F53;
    line-height: 38px;
    text-align: center;
  }

  .top .topBtn button:nth-child(3) {
    width: 29%;
    height: 38px;
    background: rgba(207, 207, 207, 1);
    border-radius: 6px;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 38px;
    text-align: center;
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
  }

  .top .classList ul {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between
  }

  .top .classList ul li {
    width: 30%;
    height: 24px;
    overflow: hidden;
    position: relative;
  }

  .top .classList ul li p {
    display: block;
    width: 74%;
    height: 22px;
    border: 1px solid rgba(182, 160, 121, 1);
    ;
    border-radius: 4px;
    font-size: 12px;
    line-height: 22px;
    padding-left: 6px;

  }

  .top .classList ul li span {
    width: 20%;
    height: 24px;
    position: absolute;
    top: 0;
    right: 2px;
    background: rgba(182, 160, 121, 1);
    border-radius: 0px 4px 4px 0px;
  }

  .top .classList ul li span::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
  }

  .companyList {
    width: 88%;
    overflow: hidden;
    margin: 0 auto;
  }

  .companyList ul {
    width: 100%;
    overflow: hidden;
  }

  .companyList ul li {
    width: 100%;
    overflow: hidden;
    height: 116px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .comList {
    width: 92%;
    margin: 0 auto;
  }

  /* 底部 */
  .bottom {
    width: 100%;
    height: 55px;
    background: #3F434F;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 30px;
    padding-right: 15px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
  }

  .bottom .content {
    flex: 1;
    width: 0;
    font-size: 16px;
    color: #fff;
  }

  .bottom .btn {
    width: 110px;
    height: 40px;
    background-image: linear-gradient(to right, #E2C78F, #D5AE61);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .bottom .round {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-right: 15px;
  }

  .bottom .round.active {
    border: 1px solid #E2C78F;
  }

  .bottom .round b {
    display: flex;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: #ccc;
  }

  .bottom .round b.active {
    background-color: #E2C78F;
  }

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

</style>
