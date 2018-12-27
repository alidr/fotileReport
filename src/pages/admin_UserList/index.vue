<template>
  <!-- 用户列表管理 -->
  <div class="UserList companyTop" :class="{active:Mask}">
    <div class="top ">
      <div class="serchTop">
        <div class="search">
        <input type="text" placeholder="请搜索姓名/组织名称/手机号" v-model="Keyword">
        <span @click="getList()">搜索</span>
        </div>

        <button type="button"  @click="addUser" v-if="isShow">添加</button>
      </div>
      
      <div class="FilterConditions ">
        <div class="filter" @click="maskStatus(0)" v-if='postShow'>
          <div>
            <span class="filterResult" :class="{active:hasMask[0]}">{{salesNum!=0?salesText:statusSelect}}</span>
            <span v-if='salesNum!=0' :class="{active:hasMask[0]}">({{salesNum}})</span>
            <img src="./2.png" class="icon" alt="" v-if='hasMask[0]'>
            <img src="./1.png" class="icon" alt="" v-else>
          </div>

        </div>
        <div class="mask" v-show="hasMask[0]"></div>

        <i v-if='postShow'></i>

        <!-- 时间排序 -->
        <div class="filter" >
          <div class="timeChange" @click='changeTime()'>
            <span class="filterResult" >申请时间{{shunXuText}}</span>
            <img src="./timeIcon.png" class="timeIcon" alt="">
          </div>
        </div>
      </div>

      <div class="allpostMask" v-show="hasMask[0]">
              <ul class="selectListStatus" v-show="hasMask[0]">
                <li v-for="(item,index) in Status" :key="index" :class="{active:index==statusHasActive}" @click="statusListActive(index,item.Name,item.ID)">{{item.Name}}</li>
              </ul>
      </div>
      <!-- <div class="letterSort" v-if="hasMask[0]&&sortArr.length>0">
        <p v-for='(item,index) in sortArr' @click='namePosition(item,index)' :class='{active:index==zmFlag}'>{{item}}</p>
      </div> -->
    </div>

    <div class="contentList">
  <div class="scroll-list-wrap">
      <cube-scroll
        ref="scroll"
        :data="list"
        :options="options"
        @pulling-up="onPullingUp">
    <div class="UserListAll">
      <ul>
        <li v-for="(item,index) in list" :key="index">

          <div class="listTop">
            <span class="name">{{item.Name}}</span>

            

            <img src="./delete.png" alt="" @click.stop="deleteShopMask(true,item.ID)" v-if="dealer">
            <div class="listMid">
              <span class="JobName">{{item.JobName}}</span>
  
  
              <span class="Organization" v-if="item.Organization">组织： {{item.Organization}}</span>
            </div>
          </div>
          
          <div class="listBottom">
            <p v-if="item.IsShow">已签约／总数：
              <span>{{item.Count}}</span>／{{item.TotalCount}}</p>
            <a href="javascript:;" @click="editUser(item.ID)">
              <i>点击详情>></i>
            </a>
          </div>
        </li>
      </ul>
      <empty v-if='emptyFlag'></empty>
    </div>
 </cube-scroll>
    </div>
  </div>
    <div id="mask" v-show="deleteShopWarn">
      <div class="maskContain">
        <div class="content">
          确认删除吗？
        </div>
        <div class="btn">
          <span class="cancel" @click="deleteShopMask(false)">取消</span>
          <span class="confirm" @click="deleteUser">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import axios from "axios"
  import qs from "qs";
  import empty from '../../components/empty'


  export default {
    name: 'UserList',
    data() {
      return {
        leftActive: -1,
        rightActive: -1,
        textColor: true,
        sortArr: [], //字母排序
        postShow: true, //岗位筛选显示隐藏
        moreNum: 0, //高级筛选数量现实
        salesNum: 0, //岗位筛选业务员数量显示
        salesNumFlag: false,
        salesmanFlag: true, //全部业务员
        distribFlag: true, //全部经销商
        allClassify: true, //全部公司分类
        allStatus: true, //全部公司状态
        isStyle: [],
        isStatus: [],
        salesArr: [],
        isFoodActive: [],
        salesMask: false, //业务员列表
        TypeID: false,
        StatusID: '',
        Keyword: '',
        list: [],
        isShow: false,
         Mask: false,
        // 公司状态列表
        Status: [],
        // 公司类型列表
        allStateText: [{
          ID:false,
          Name:'时间逆序'
        },{
          ID:true,
          Name:'时间顺序'
        },
        ],
        hasMask: [false, false, false],
        // hasStatusMask:false,
        // hasStyleMask:false,
        // hasPersonMask:false,
        personSelect: "时间排序",
        statusHasActive: 0,
        statusSelect: "全部岗位",
        emptyFlag: false,
        dealer:false,
        deleteShopWarn:false,
        shopID:'',
         pageCount:1,
        page:1,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
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
        salesText: '业务员',
        leftList: [],
        rightList: [],
        allText: '',
        linShiArr: [],
        positionID: [],
        leftAllText: '',
        rightIdArr: [],
        checkBox: false,
        clickFlag: true,
        allColor: true,
        boxFlag: false,
        startArr: [],
        zmFlag: -1,
        allClick:true,
        quanBu:'全部',
        leftTextColor:true,
        JobID:[],
        shunXuText:'顺序',
        niXuText:'逆序'

      }
    },
    components:{
      empty
    },
    computed: {
      options() {
    return {
      pullUpLoad: this.pullUpLoadObj,
      scrollbar: true
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
  pullUpLoadObj: function() {
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
    created() {
      this.getStyleList()
      this.getList()
      if (this.AccessId == -1 || this.AccessId == 3||this.AccessId == 2) {
        //管理员
         this.dealer = true
      } else if (this.AccessId == 4) {
        //经销商
        // this.getBusiness()
        this.dealer = false
      }
      

    },
    methods: {
        onPullingUp() {
          // 更新数据
           if (this.pageCount>=this.page) {
             this.getList(this.page)
           }else{
             this.$refs.scroll.forceUpdate()
           }
        },
      deleteShopMask(bool,ID){
        this.deleteShopWarn = bool;
        this.shopID = ID||""
      },
     
       // 岗位筛选遮罩
       maskStatus(index) {
        console.log(index);
        console.log(this.hasMask[index]);
        
        if (this.hasMask[index] == true) {
          
          this.hasMask[index] = false
        } else {
          this.hasMask=[false,false]
          this.hasMask[index] = true

        }
        this.hasMask = this.hasMask.slice()
        this.Mask = this.hasMask[index] ? true : false
      },

      //右边全部按钮点击
      rightAllClick(){
        if(this.salesNum!=0){
          this.isFoodActive=[]
          this.textColor=true
          this.rightAllText=this.leftAllText
          this.salesNum=0
          return false
        }
        this.Status.forEach((y)=>{
          this.textColor=true
          this.leftTextColor=true
          this.rightActive=-1
          let JobIDLen
          let rightID=this.rightIdArr.indexOf(y.ID)
          this.leftList.forEach((s)=>{
            JobIDLen=this.JobID.indexOf(s.JobID)
          if(this.JobID.indexOf(s.JobID)<=-1){
            this.JobID.push(s.JobID)
          }
         
        })
        if(JobIDLen==-1&&this.leftAllText!=this.rightAllText){
          this.leftList.splice(JobIDLen)
            this.positionID.splice(JobIDLen)
            this.rightIdArr.splice(rightID)
        console.log(JobIDLen)

        }
        if(JobIDLen>-1&&this.leftAllText!=this.rightAllText){
          console.log(JobIDLen,'JobIDLen')
            this.leftActive=-1
            this.leftTextColor=true
            this.textColor=true
            this.leftList.splice(JobIDLen)
            this.positionID.splice(JobIDLen)
            this.rightIdArr.splice(rightID)
        }
        
          if (y.JobID == 1) {
            this.leftAllText = this.quanBu+'分总'
          }
          if (y.JobID == 2) {
            this.leftAllText = this.quanBu+'部门经理'
          }
          if (y.JobID == 3) {
            this.leftAllText = this.quanBu+'区域经理'
            
          }
          if (y.JobID == 4) {
            this.leftAllText = this.quanBu+'经销商'
          }
          if (y.JobID == 5) {
            this.leftAllText = this.quanBu+'业务员'
            if(this.isFoodActive.indexOf(y.ID)>-1){
              this.isFoodActive=[]
              this.textColor=true
              this.leftTextColor=true
              this.allColor=false
            }
          }
         this.rightAllText=this.leftAllText
        })

      },
      //左边全部按钮点击
      leftAllClick() {
        this.textColor=true
        this.leftTextColor=true
        this.leftActive=-1
        this.rightActive=-1
        let allSale=this.leftList[this.leftList.length-1]
        this.Status=allSale.list
        this.leftAllText=this.rightAllText
        allSale.list.forEach((i)=>{
          if(i.list.length==0){
            this.checkBox=true
          }
        })

      },
      //右边列表的点击
      rightClick(item, index) {
        if (item.JobID == 1) {
            this.leftAllText = this.quanBu+"部门经理"
          }
          if (item.JobID == 2) {
            this.leftAllText = this.quanBu+"区域经理"
          }
          if (item.JobID == 3) {
            this.leftAllText = this.quanBu+"经销商"
          }
          if (item.JobID == 4) {
            this.leftAllText = this.quanBu+"业务员"
          }
          this.rightAllText=this.leftAllText
         
        this.allColor = false
        let positionID = this.positionID.indexOf(item.positionID)
        let rightID = this.rightIdArr.indexOf(item.ID)
        
        if (this.leftList.length == 0) {
          this.leftList.push(item)
          this.rightIdArr.push(item.ID)
          this.leftActive=-1
          this.leftTextColor=true
          this.textColor=true
          this.positionID.push(item.positionID)
        }
        if (this.leftList.length == 1) {
          this.leftList.forEach((g) => {
            if (item.positionID != g.positionID) {
              if (this.rightIdArr.indexOf(item.ID) < 0) {
                this.rightIdArr.push(item.ID)
                this.leftList.push(item)
                this.leftActive=-1
                this.leftTextColor=true
                this.textColor=true
              }
              if (this.positionID.indexOf(item.positionID) < 0) {
                this.positionID.push(item.positionID)
              }
            }

            if (item.positionID == g.positionID) {

              this.rightIdArr = []
              this.leftList = []
              if (this.rightIdArr.indexOf(item.ID) < 0) {

                this.rightIdArr.push(item.ID)
                this.leftList.push(item)
                this.leftActive=-1
                this.leftTextColor=true
                this.textColor=true
              }
            }

          })

        }
        if (this.leftList.length > 1) {
          this.leftList.forEach((g) => {
            if (this.rightIdArr.indexOf(item.ID) < 0) {
              this.rightIdArr.push(item.ID)
              this.leftList.push(item)
              this.leftActive=-1
              this.leftTextColor=true
              this.textColor=true
              if (this.positionID.indexOf(item.positionID) < 0) {
                this.positionID.push(item.positionID)
              }
            }else{
            }
            if (item.positionID == g.positionID && item.ID != g.ID) {
              this.leftActive=-1
              this.leftTextColor=true
              this.textColor=true
              this.leftList.splice(positionID, this.leftList.length - 1 - positionID)
              this.positionID.splice(positionID + 1, this.positionID.length - 1 - positionID)
              this.rightIdArr.splice(rightID + 1, this.rightIdArr.length - 1 - rightID)
            }
          })
        }
        this.rightActive = -1

        item.list.forEach((k, l) => {
          if (k.list.length <= 0) {
            this.clickFlag = false
            this.checkBox = true
            this.leftActive = -1
            this.textColor = true
            this.leftTextColor=true
          } else {
            this.checkBox = false
            this.clickFlag = true
          }
        })
        this.Status = item.list
        this.sortArr = item.zmlist
      },
      //左边列表的点击
      leftClick(item, index) {
        if (item.JobID == 1) {
            this.leftAllText = this.quanBu+"分总"
          }
          if (item.JobID == 2) {
            this.leftAllText = this.quanBu+"部门经理"
          }
          if (item.JobID == 3) {
            this.leftAllText = this.quanBu+"区域经理"
          }
          if (item.JobID == 4) {
            this.leftAllText = this.quanBu+"经销商"
          }
         
        this.leftActive = index
        if (this.leftActive >= 0) {
          this.textColor = false
          this.leftTextColor=false
        }
        if (item.list.length >= 0) {
          this.checkBox = false
          this.clickFlag = true

        } else {
          this.checkBox = true
          this.clickFlag = false
        }
        this.leftActive = index
        let idArr = []
        this.leftList.forEach((e, f) => {
          e.list.forEach((c, d) => {
            if (idArr.indexOf(c.ID) < 0) {
              idArr.push(c.ID)
            }
            if (item.ID == c.ID) {
              this.Status = e.list
              this.sortArr = e.zmlist
              this.rightActive = d
            }
          })
        })

        if (idArr.indexOf(item.ID) < 0) {
          this.Status = this.startArr
          this.Status.forEach((t, i) => {
            this.sortArr = t.zmlist
            if (t.ID === item.ID) {
              this.rightActive = i
            }
          })
        }
      },
      checkSales(item) {
        this.topHight = event.currentTarget.offsetTop
        this.salesmanFlag = false
        let id = item.ID
        let indexId = this.isFoodActive.indexOf(id);
        if (indexId < 0) {
          this.isFoodActive.push(id);
          this.salesNum = this.isFoodActive.length
          this.SaleID = this.isFoodActive.join(',')
          this.rightAllText="业务员"+"("+this.salesNum+")"

        } else {
          this.isFoodActive.splice(indexId, 1);
          this.salesNum = this.isFoodActive.length
          this.rightAllText="业务员"+"("+this.salesNum+")"
          if (this.salesNum == 0) {
            this.rightAllText = this.quanBu+"业务员"
            this.leftAllText = this.quanBu+"业务员"
            this.textColor=true
          }
          this.SaleID = this.isFoodActive.join(',')
        }
        if (this.isFoodActive.indexOf(item.ID) > -1) {
          this.textColor = false
          this.leftTextColor=true
        }
      },
       // 首字母定位
       namePosition(item, index) {
        this.zmFlag = index
        let newList = this.sortArr.slice(0, this.sortArr.indexOf(item))
        let number = 0
        this.Status.forEach((el) => {
          if (newList.indexOf(el.ZM) > -1) {
            number++
          }
        })
        this.scrollTo(number)
      },
      scrollTo(number) {
        var liHeight = 40 //li的高度
        this.$refs.scrollSale.scrollTo(0, this.scrollToY = -((number) * liHeight), )
      },
      sureSales(){
        if(this.salesNum>0){
          this.SaleID=this.isFoodActive.join(',')
        }
        this.DealerID=this.leftList[this.leftList.length-1].ID
        this.page = 1
        this.getList()
        this.hasMask = [false, false, false]
      },
      statusListActive(index, name,id) {
        this.statusHasActive = index
        this.statusSelect = name
        this.hasMask[0] = false
        this.StatusID = id
        this.getList()
        this.$refs.scroll.scrollTo(0,0)
        // this.isShow = true

      },
      // 时间排序
      changeTime() {
        this.TypeID=!this.TypeID
        this.getList()
        this.$refs.scroll.scrollTo(0,0)
      },
      getStyleList(){
        axios({
          url:this.getHost()+'/Notice/JobInfo', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token')
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.Status = res.data.Data.list
            this.Status.unshift({
                ID: '',
                Name: '全部岗位'
            })
          }else if (res.data.Status<0) {
            this.getToast("登录失效，请重新登录",'warn')
            setTimeout(() => {
              this.delCookie("UserId")
              this.delCookie("token")
              this.setAccessId('')
              location.replace('/')
            }, 2000);
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
      },
      getList(page) {
        this.page = page||1
        axios({
            url: this.getHost() + '/UserInfo/GetUserInfoList',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Keyword: this.Keyword,
              JobId: this.StatusID,
              Sort: this.TypeID,
              page:page||1
            })
          })
          .then(res => {
            console.log(res,2)
            if (res.data.Status === 1) {
              this.pageCount = res.data.Data.pageCount
                if (this.page==1) {
                  this.list = res.data.Data.list
                }else{
               if (this.list.length>0&&this.page>1) {
                  // 如果有新数据
                  // let newPage = _foods.slice(0, 5)
                  this.list = this.list.concat(res.data.Data.list)
                  
                }
                }
              this.page++
              if (this.list.length==0) {
                this.emptyFlag = true
              }else{
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
          .catch(res => {
            this.getToast(res.data.Message, 'warn')
          })
      },
      addUser() {
        this.$router.push({
          'path': '/addUser'
        })
      },
      editUser(ID) {
        this.$router.push({
          path: '/editUser',
          query: {
            id: ID
          }
        })
      },
      deleteUser() {
        axios({
            url: this.getHost() + '/UserInfo/DelUserInfo',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Id: this.shopID
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.getToast("删除成功", 'warn')
              this.deleteShopMask(false)
                this.getList()
                // this.isShow = true

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
      ...mapMutations({
      setAccessId: 'SET_ACCESSID'
    })

    }
}

</script>

<style scoped>
  @import '../../common/filterH.css';
  @import '../../common/mask.css';
  .contentList .scroll-list-wrap {
  height: calc(100vh - 150px);
}

.allMask .saleWarp {
    width: 100%;
    height: 60vh;
    background-color: #F5F5F5;
    overflow-y: scroll !important;
    -webkit-overflow-scrolling: touch;

  }

  .UserList {
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
  .serchTop{
    display: flex;
    align-items: center;
  }
  .top .search {
    /* float: left; */
    /* width: 74%; */
    width: 0;
    flex-grow: 1;
    height: 40px;
    /* margin-left: 15px; */
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
    border: 1px solid rgba(208, 208, 208, 1);
    border-radius: 4px;

  }

  .top .search input {
    width: 80%;
    height: 96%;
    border: none;
    background: none;
    padding-left: 14px;
    border: none;
    border-radius: 4px;

  }

  .top .search span {
    display: block;
    width: 18%;
    height: 40px;
    background: rgba(182, 160, 121, 1);
    border-radius: 0px 4px 4px 0px;
    /* position: absolute;
    right: 0;
    top: 0; */
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
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
    width: 42%;
    flex: none;
  }


  .UserListAll {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
  }

  .UserListAll ul {
    width: 100%;
    overflow: hidden;
  }

  .UserListAll ul li {
    width: 100%;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }

 
  .UserListAll ul li .listTop {
    width: 92%;
    overflow: hidden;
    margin: 0 auto;
    border-bottom: 1px solid #F0F0F0;
    padding-top: 14px;
    padding-bottom: 10px;
    position: relative;
  }

  .UserListAll ul li .listTop .name {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    font-weight: 650;
    margin-right: 26px;

  }

  .UserListAll ul li .listTop .JobName {
    font-size: 11px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    font-weight: normal;
    margin-right: 12px;
    line-height: 22px;

  }

  .UserListAll ul li .listTop .Organization {
    font-size: 11px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    font-weight: normal;
    margin-right: 12px;
    line-height: 22px;

  }

  .UserListAll ul li .listTop img {
    position: absolute;
    right: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: block;
    width: 35px;
    margin-right: 15px;

  }


  .UserListAll ul li .listBottom {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    padding-top: 10px;
    
  }

  .UserListAll ul li .listBottom p {
    float: left;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    padding-left: 14px;
  }

  .UserListAll ul li .listBottom p span {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: #B6A079;
  }

  .UserListAll ul li .listBottom a i {
    float: right;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    margin-right: 11px;
    font-style: normal;
  }
.listMid{
  padding-top: 10px;
}
.allState{
  justify-content: space-around !important;
}
.timeChange{
  display: flex;
}
.timeIcon{
  display: block;
  width:12px;
  height: 13px;
  margin-top: 1px;
}
.allpostMask{
  background: white;
  position: absolute;
  z-index: 300;
  width: 100%;
}

</style>
