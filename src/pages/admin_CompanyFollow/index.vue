<template>
  <!-- 公司待跟进 -->
  <div class="CompanyFollow" :class="{active:Mask}">
    <div class="top companyTop">
      <div class="search">
        <input type="text" placeholder="请搜索公司名称关键词" v-model="keyword">
        <span @click="search">搜索</span>
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
         <div class="filter" v-if="!selected">
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
    :data="list"
    :options="options"
    @pulling-up="onPullingUp">
    <div class="companyList">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="companyDetail(item.ID)">
          <a href="javascript:;">
            <div class="listTop">
              <span v-if="item.IsEmphasis">
                <img src="./guanzhu_03.png" alt="">
              </span>
              <b>剩余保护期：{{item.EndDate}}天</b>
            </div>
            <div class="listMid">
              <span :class="{active:checkBoxs[index]}" v-if="selected" @click.stop="check(index,item.ID)"></span>
              <button class="smallBtn" type="button" :class="{red:item.Status==-2,yellow:item.Status==0,grey:item.Status==-1}">{{item.StatusName}}</button>
              <p>{{item.Name}}</p>
            </div>
            <div class="listBottom">
              <i v-if="!item.CreateDate==''">{{item.CreateDate}}</i>
              <p v-if="!item.CreateDate==''">{{item.Content}}</p>
              <b v-if="!item.CreateDate==''">{{item.UserName}}</b>
              <i v-if="item.CreateDate==''">暂无跟单消息</i>
            </div>
          </a>

        </li>
      </ul>
      <empty v-if='emptyFlag'></empty>
    </div>
  </cube-scroll>
</div>

    <footer v-if="selected">
      <span :class="{active:checkAllBox}" @click="checkAll(list)"></span>
      <p>已选择
        <b>{{idList.length}}</b>个家装公司</p>
      <button type="button" @click="distribution">分配业务员</button>
    </footer>

     <!-- <empty v-if='emptyFlag'></empty> -->
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  import { mapGetters, mapMutations } from 'vuex'
  import empty from "../../components/empty"
  export default {
    name: 'CompanyFollow',
    data(){
      return{
        pageCount:1,
        page:1,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
        list:[],
        checkBoxs:[],
        checkAllBox:false,
        idList:[],
        selected:true,
        emptyFlag: false,
        keyword:'',
        StatusID:'',
        TypeID:'',
        SaleID:'',
        Mask: false,
        Person: [],
        personHasActive: 0,
        personSelect: "全部组员",
        // 公司状态列表
        Status: [{
          ID: '',
          Name: '全部状态'
        }, {
          ID: -1,
          Name: '已放弃'
        }, {
          ID: -2,
          Name: '已删除'
        }, {
          ID: 0,
          Name: '已新建'
        }],
        // 公司类型列表
        Style: [],
        hasMask: [false, false],
        // hasStatusMask:false,
        // hasStyleMask:false,
        // hasPersonMask:false,
        statusHasActive: 0,
        statusSelect: "全部状态",
        styleHasActive: 0,
        styleSelect: "全部类型",
        emptyFlag: false,
      }
    },
    components:{
      empty
    },
    created(){
      localStorage.removeItem("CompanyID")
      if (this.AccessId==-1) {
        this.getList()
      }else if (this.AccessId==5){
        this.getMyMember()
        this.selected = false
        this.getPersonList()
      } 
      this.getStyleList()
      
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
    components:{
      empty
    },
    methods:{
      onPullingUp() {
          // 更新数据
      
           
           if (this.pageCount>=this.page) {
                if (this.AccessId==-1) {
                this.getList()
              }else if (this.AccessId==5){
                this.getMyMember()
              } 
           }else{
             this.$refs.scroll.forceUpdate()
           }
        },
      getPersonList(){
        axios({
          url:this.getHost()+'/UserInfo/GetGroupUserList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token')

          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.Person = res.data.Data.list
            this.Person.unshift({
                ID: '',
                Name: '全部组员'
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
       personListActive(index, name,id) {
        this.personHasActive = index
        this.personSelect = name
        this.hasMask[2] = false
        this.SaleID=id
        this.getMyMember()
      },
      search(){
        this.page = 1
        if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
          this.selected = false
        } 
      },
       getStyleList(){
        axios({
          url:this.getHost()+'/Notice/CompanyList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token')
          })
        })
        .then(res=>{
          console.log(res,33)
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
      maskStatus(index) {
        console.log(index);
        console.log(this.hasMask[index]);
        
        if (this.hasMask[index] == true) {
          
          this.hasMask[index] = false
        } else {
          this.hasMask=[false,false]
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
         if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
          this.selected = false
        } 
      },
      styleListActive(index, name,id) {
        this.styleHasActive = index
        this.styleSelect = name
        this.hasMask[1] = false
        this.TypeID=id
        this.page = 1
         if (this.AccessId==-1) {
          this.getList()
        }else if (this.AccessId==5){
          this.getMyMember()
          this.selected = false
        } 
             
      },
      companyDetail(id){
        this.$router.push({
          path:'/companyDetail',
          query:{
            id:id,
            stylePlay:1
          }
        })
      },
      getMyMember(){
        axios({
          url:this.getHost()+'/UserInfo/GetUserCompanyList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Status:this.StatusID,
            CategoryID:this.TypeID,
            Keyword:this.keyword,
            SaleID:this.SaleID,
            // Page:1
          })
        })
        .then(res=>{
          console.log(res,77)
          if (res.data.Status===1) {
            this.pageCount = res.data.Data.pageCount
                if (this.page==1) {
                  this.list = res.data.Data.list
                  console.log(this.list,999)
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


            // this.list  = res.data.Data.list    
            // if (this.list.length==0) {
            //     this.emptyFlag = true
            // }else{
            //     this.emptyFlag = false
            // }      
          }else if (res.data.Status<0) {
            this.delCookie("UserId")
            this.delCookie("token")
            this.setAccessId('')
            location.replace('/')
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
      },
      getList(page){
        axios({
          url:this.getHost()+'/Admin/WaitFollowList', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            Status:this.StatusID,
            CompanyTypeID:this.TypeID,
            Keyword:this.keyword,
            page:page||1
          })
        })
        .then(res=>{
          console.log(res,88)
          if (res.data.Status===1) {
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
            for (let i = 0; i < this.list.length; i++) {
              this.checkBoxs.push(false)
              
            } 
            
            console.log(this.checkBoxs);
            if (this.list.length==0) {
                this.emptyFlag = true
            }else{
                this.emptyFlag = false
            } 
                      
          }else if (res.data.Status<0) {
            this.delCookie("UserId")
            this.delCookie("token")
            this.setAccessId('')
            location.replace('/')
          }
          else{
            this.getToast(res.data.Message,'warn')
          }
        })
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
      checkAll(list){
        
        if (this.checkAllBox) {
          console.log(111)
          this.checkAllBox =false
          console.log(this.checkBoxs);
          this.idList = this.idList.splice()
          for (let i = 0; i <list.length; i++) {
            this.checkBoxs[i]= false
          }
          this.checkBoxs = this.checkBoxs.slice()
        }else{
          console.log(222);
          
          this.checkAllBox = true
          for (let i = 0; i < list.length; i++) {
            this.checkBoxs[i] = true
            this.idList.push(list[i].ID)
          }
           this.checkBoxs = this.checkBoxs.slice()
           this.idList = this.idList.slice()
           console.log(this.checkBoxs);
        }
        console.log(this.idList);

      },
      distribution(){
        if (this.idList.length==0) {
          this.getToast("请选择要分配的公司",'warn')
        }else{
          localStorage.setItem("CompanyID",JSON.stringify(this.idList))
          this.$router.push({
            path:'/SalesmanList'
          })
        }
      }

    }
  }

</script>

<style scoped>
  @import '../../common/filter.css';

  .scroll-list-wrap {
  height: calc(100vh - 150px);
}
  .FilterConditions {
    padding: 0 10px;
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
  .top .classList .filter{
    margin-right: 0;
    width: 42%;
    flex: none;
  }




  .companyList {
    width: 92%;
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
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 10px;
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
    margin-right: 10px;
  }

  .companyList ul li a .listMid {
    overflow: hidden;
    width: 88%;
    padding-top: 16px;
    margin: 0 auto;
    padding-bottom: 14px;
    border-bottom: 1px solid #F0F0F0;
    margin-bottom: 12px;
  }

  .companyList ul li a .listMid span {
    float: left;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-left: 6px;
    border: 1px solid #ccc;
    position: relative;
    margin-right: 14px;
  }
  .companyList ul li a .listMid span.active{
    border: 1px solid rgba(226, 199, 143, 1);
  }
  .companyList ul li a .listMid span.active::before{
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

  .smallBtn {
    display: block;
    float: left;
    /* width: 22%;
    height: 20px; */
    /* background: rgba(207, 207, 207, 1); */
    border-radius: 3px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    /* color: rgba(255, 255, 255, 1); */
    line-height: 20px;
    text-align: center;
    margin-right: 12px;
    padding: 0 10px;
  }

  .companyList ul li a .listMid p {
    float: left;
    width: 60%;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
    word-break: break-all;
  }

  .companyList ul li a .listBottom {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }

  .companyList ul li a .listBottom i {
    font-size: 10px;
    color: rgba(102, 102, 102, 1);
    font-style: normal;
    padding-left: 20px;
  }

  .companyList ul li a .listBottom p {
    width: 30%;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .companyList ul li a .listBottom b {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    padding-right: 10px;
  }

  footer {
    width: 100%;
    height: 55px;
    background: #636770;
    position: fixed;
    bottom: 0;
    left: 0;
  }

  footer span {
    float: left;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-left: 6px;
    border: 1px solid #ccc;
    position: relative;
    margin-right: 14px;
    margin-top: 19px;
    margin-left: 36px;
  }
  footer span.active{
     border: 1px solid rgba(226, 199, 143, 1);
  }
  footer span.active::before{
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
    float: left;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 55px;
  }

  footer button {
    float: right;
    display: block;
    width: 115px;
    height: 40px;
    border-radius: 4px;
    background: #E2C78F;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    text-align: center;
    margin-right: 24px;
    margin-top: 8px;
  }
  .red{
  background: #FBC1B4 ;
  color: #F26F53 !important;
}
.yellow{
  background: #F6EAD4 ;
  color: #BB9F61 ;
}
.grey{
  background:#CFCFCF ;
  color: #fff ;
}

</style>
