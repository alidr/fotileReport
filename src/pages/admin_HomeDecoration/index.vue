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
        <div class="filter">
          <span class="filterResult">{{statusSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(0)"></span>
        </div>
        <div class="filter">
          <span class="filterResult">{{styleSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(1)"></span>
        </div>
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
    <div class="scroll-list-wrap">
      <cube-scroll
        ref="scroll"
        :data="List"
        :options="options"
        @pulling-up="onPullingUp">
            <!-- 公司列表 -->
            <div class="comList">
              <focusList :list="List" id="list" v-if="!admin" :Action="active"></focusList>
                <!-- <companyFilter v-if="admin" :list="List"></companyFilter> -->
              <empty v-if='emptyFlag'></empty>
              <div>
              <div class="contentList" v-for="(item,index) in List" :key="index"  v-if="admin" @click="jump(item.ID)">
                <div class="contentListTop">
                  <p class="firstLine">
                    <span :class="{red:item.Status==2,yellow:item.Status==1,grey:item.Status==3}">{{item.StatusName}}</span>
                    <span v-if="item.Status!=3">剩余保护期:{{item.EndDate}}天</span>
                  </p>
                  <p class="twoLine">
                    <a href="javascript:;" class="round" :class="{'active':checkBoxs[index]}" @click.stop="check(index,item.ID)"><b :class="{'active':checkBoxs[index]}"></b></a>
                    <a href="javascript:;" class="name">{{item.Name}}</a>
                    <!-- <a href="javascript:;" class="btn">+行动</a> -->
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
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'HomeDecoration',
    data() {
      return {
        pageCount:1,
        page:1,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
        admin:false,
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
        Status: [{
          ID: '',
          Name: '全部状态'
        }, {
          ID: 1,
          Name: '洽谈中'
        }, {
          ID: 2,
          Name: '签约中'
        }, {
          ID: 3,
          Name: '已签约'
        }],
        // 公司类型列表
        Style: [],
        // 业务员
        Person: [],
        hasMask: [false, false, false],
        // hasStatusMask:false,
        // hasStyleMask:false,
        // hasPersonMask:false,
        statusHasActive: 0,
        statusSelect: "全部状态",
        personHasActive: 0,
        personSelect: "全部业务员",
        styleHasActive: 0,
        styleSelect: "全部类型",

        // list:[],
        checkBoxs:[],
        checkAllBox:false,
        idList:[],
        active:false,
        
      }

    },
     computed: {
       options() {
        return {
          pullUpLoad: this.pullUpLoadObj,
          scrollbar: true
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
      if (this.AccessId == -1||this.AccessId == 4) {
        this.admin = true
      }
      if (this.AccessId==5) {
        this.active = true
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
       distribution(){
        if (this.idList.length==0) {
          this.getToast("请选择要分配的公司",'warn')
        }else{
          localStorage.setItem("CompanyID",JSON.stringify(this.idList))
          this.$router.push({
            path:'/SalesmanList',
            query:{
              style:1
            }
          })
        }
      },
      check(index,id){
        console.log(index)
        if (this.checkBoxs[index]) {
          this.checkBoxs[index]=false
          this.checkAllBox = false
          for (let i = 0; i <  this.idList.length; i++) {
          if (this.idList[i]==id) {
            this.idList.splice(i)
            }
          }

          for (let i = 0; i < this.checkBoxs.length; i++) {
          if (this.checkBoxs[i]) {
             this.checkAllBox = true
          }
        }
          
        }else{
          this.checkBoxs[index]=true
          this.idList.push(id)
          this.checkAllBox = true
        } 

        this.idList = this.idList.slice()
        this.checkBoxs = this.checkBoxs.slice()
        console.log(this.idList);
        

      },
      checkAll(List){
        
        if (this.checkAllBox) {
          console.log(111)
          this.checkAllBox =false
          console.log(this.checkBoxs);
          this.idList = this.idList.splice()
          for (let i = 0; i <List.length; i++) {
            this.checkBoxs[i]= false
          }
          this.checkBoxs = this.checkBoxs.slice()
        }else{
          console.log(222);
          
          this.checkAllBox = true
          for (let i = 0; i < List.length; i++) {
            this.checkBoxs[i] = true
            this.idList.push(List[i].ID)
          }
           this.checkBoxs = this.checkBoxs.slice()
           this.idList = this.idList.slice()
           console.log(this.checkBoxs);
        }
        console.log(this.idList);

      },
      jump(num){
        this.$router.push({
          path: '/companyDetail',
          query: {
            id: num
          }
        })
      },
      getStyleList(){
        this.axiosloading()
        axios({
          url:this.getHost()+'/Notice/CompanyList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token')
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.Style = res.data.Data.list
            this.Style.unshift({
                ID: '',
                Name: '全部类型'
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
      getPersonList(){
        this.axiosloading()
        axios({
          url:this.getHost()+'/Company/SaleList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Keyword:''

          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.Person = res.data.Data.list
            this.Person.unshift({
                ID: '',
                Name: '全部业务员'
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
              page:page||1
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.pageCount = res.data.Data.pageCount
                if (this.page==1) {
                  this.List = res.data.Data.list
                }else{
               if (this.List.length>0&&this.page>1) {
                  // 如果有新数据
                  // let newPage = _foods.slice(0, 5)
                  this.List = this.List.concat(res.data.Data.list)
                  
                }
                }
              this.page++
              if (this.List.length==0) {
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
            console.log(res)
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
          this.hasMask=[false,false,false]
          this.hasMask[index] = true

        }
        this.Mask = this.hasMask[index] ? true : false
      },
      statusListActive(index, name,id) {
        this.statusHasActive = index
        this.statusSelect = name
        this.hasMask[0] = false
        this.StatusID = id
        this.page = 1
        this.getList()
      
      },
      styleListActive(index, name,id) {
        this.styleHasActive = index
        this.styleSelect = name
        this.hasMask[1] = false
        this.TypeID=id
        this.page = 1
        this.getList()
             
      },
      personListActive(index, name,id) {
        this.personHasActive = index
        this.personSelect = name
        this.hasMask[2] = false
        this.SaleID=id
        this.page = 1
        this.getList()
      }
    }
  }

</script>

<style scoped>
  @import '../../common/filter.css';
  @import '../../common/focusList.css';
/* .companyTop.active{
  height: 100vh;
  overflow: hidden;
} */
.scroll-list-wrap {
  height: calc(100vh - 210px);
}
.contentListTop{
  margin-left: 0px;
}
.contentListBottom{
  margin-left: 0px;
}
.firstLine span:nth-child(1){
  margin-left: 30px;
}
.twoLine .round{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-right: 15px;
}
.twoLine .round.active{
  border:1px solid #E2C78F;
}
.twoLine .round b{
  display: flex;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #ccc;
}
.twoLine .round b.active{
  background-color: #E2C78F;
}
  .FilterConditions {
    padding: 0 10px;
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
    padding-bottom: 16px;
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
  .bottom{
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
    z-index: 999999;
  }
  .bottom .content{
    flex: 1;
    width: 0;
    font-size: 16px;
    color: #fff;
  }
  .bottom .btn{
    width: 110px;
    height: 40px;
    background-image: linear-gradient(to right,#E2C78F,#D5AE61);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .bottom .round{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-right: 15px;
  }
  .bottom .round.active{
    border:1px solid #E2C78F;
  }
  .bottom .round b{
    display: flex;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: #ccc;
  }
  .bottom .round b.active{
    background-color: #E2C78F;
  }
  .red{
  border:1px solid #F26F53;
  color: #F26F53
}
.yellow{
  border:1px solid #BB9F61;
  color: #BB9F61;
}
.grey{
  border:1px solid #BFBFBF;
  color:  #BFBFBF;
}
</style>
