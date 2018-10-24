<template>
  <!-- 用户列表管理 -->
  <div class="UserList">
    <div class="top companyTop">
      <div class="serchTop">
        <div class="search">
        <input type="text" placeholder="请搜索姓名/组织名称/手机号" v-model="Keyword">
        <span @click="getList()">搜索</span>
        </div>

        <button type="button"  @click="addUser" v-if="isShow">添加</button>
      </div>
      <!-- v-if="isShow" -->
      
      <div class="classList">
        <div class="filter">
          <span class="filterResult">{{statusSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(0)"></span>
        </div>
        <div class="filter">
          <span class="filterResult">{{styleSelect}}</span>
          <span class="iconfont icon-xiaosanjiao icon" @click="maskStatus(1)"></span>
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
    </div>


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
        TypeID: '',
        StatusID: '',
        Keyword: '',
        list: [],
        isShow: false,
         Mask: false,
        // 公司状态列表
        Status: [],
        // 公司类型列表
        Style: [{
          ID:false,
          Name:'时间逆序'
        },{
          ID:true,
          Name:'时间顺序'
        },
        ],
        hasMask: [false, false],
        // hasStatusMask:false,
        // hasStyleMask:false,
        // hasPersonMask:false,
        statusHasActive: 0,
        statusSelect: "全部岗位",
        styleHasActive: 0,
        styleSelect: "时间排序",
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

      statusListActive(index, name,id) {
        this.statusHasActive = index
        this.statusSelect = name
        this.hasMask[0] = false
        this.StatusID = id
        this.getList()
        // this.isShow = true

      },
      styleListActive(index, name,id) {
        this.styleHasActive = index
        this.styleSelect = name
        this.hasMask[1] = false
        this.TypeID=id
        this.getList()

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
  @import '../../common/filter.css';
  @import '../../common/mask.css';
  .scroll-list-wrap {
  height: calc(100vh - 150px);
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
    padding-bottom: 16px;
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

  .top button {
    float: right;
    display: block;
    width: 14%;
    height: 40px;
    background: rgba(226, 199, 143, 1);
    border-radius: 2px;
    margin-right: 18px;
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
</style>
