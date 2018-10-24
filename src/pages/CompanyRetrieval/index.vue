<template>
  <!-- 公司检索 -->
  <div class="CompanyRetrieval">
    <div class="retrievaList">
      <div class="top">
        <div class="search">
          <input type="text" placeholder="请输入家装公司" v-model="keyword">
          <span @click="getList">搜索</span>
        </div>
      </div>
      <!-- :data="List" -->
      
      <div class="scroll-list-wrap" style="background: white;" v-if='flagList'>
        <cube-scroll
          ref="scroll"
          :data="List"
          :options="options"
          @pulling-up="onPullingDown"
          >
              <!-- 检索公司列表 -->
              <div class="everSales" >
                <ul>
                  <li v-for='(item,index) in List' :key='index'>
                    <span class="number">{{index=(index<9?('0'+(index+1)):(index+1))}}</span>
                     <button type="button" :class="{negotiation:item.Status==1,contracting:item.Status==2,contracted:item.Status==3,new:item.Status==0,giveUp:item.Status==-1,deled:item.Status==-2}">{{item.StatusName}}</button>
                    <!-- <button type="button" >洽谈中</button> -->
                    <span class="name">{{item.Name}}</span>
                    <span class="person">{{item.UserName}}</span>
                  </li>
                 
                </ul>
              </div> 
        </cube-scroll>
      </div>
      <!-- <div class="everSales" v-if='flagList'>
        <ul>
          <li>
            <span class="number">01</span>
             <button type="button" :class="{redNegotiation:item.Status==2,FollowUp:item.Status==1,contract:item.Status==3}">洽谈中</button>
            <button type="button" >洽谈中</button>
            <span class="name">家装公司名称</span>
            <span class="person">负责人：XXXXX</span>
          </li>
         
        </ul>
      </div> -->
      <div class="weiJiansuo" v-if='flagWei'>
        <img src="./weiJiansuo.png" alt="">
        <p>搜索家装公司</p>
      </div>
      <empty v-if='emptyFlag'></empty>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  import empty from "../../components/empty"
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: 'CompanyRetrieval',
    
    data() {
      return {
        
        List: [],
        // isActive:[],
        // List: [],
        idList: [],
        companyName: '',
        flagList: false,
        flagWei: true,
        emptyFlag:false,
        pageCount:0,
        // page:0,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
        admin:false,
        keyword: '',
        StatusID: '',
        TypeID: '',
        SaleID: '',
        active:false,
        pageMax:1,
        timer:null
      }
    },
    components: {
      empty,
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
   

    methods: {
      onPullingUp() {
          // 更新数据
           if (this.pageCount>=this.page) {
             this.getList(this.page)
           }else{
             this.$refs.scroll.forceUpdate()
           }
        },
        onPullingDown(){
          // 下拉刷新数据
          if(this.pageMax === this.pageCount){
             this.$refs.scroll.forceUpdate()
          }else{
             // 增加过渡时间，解决多次触发bug
            clearTimeout(this.timer)
             this.timer = setTimeout(()=>{
              this.getMoreData()  
            },1000)
          }
        },
      
      getList() {
        if(this.keyword==''){
          this.getToast("请输入公司名称", 'warn')
        }else{
          // 清空原列表
          this.List=[]
          this.pageCount = 0
          this.getMoreData()
        }
      },
        getMoreData(){
          axios({
            url: this.getHost() + '/Company/CompanyListByName',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              keyword: this.keyword,
              StatusID: this.StatusID,
              TypeID: this.TypeID,
              SaleID: this.SaleID,
              pageCount:this.pageCount+1
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.pageMax = res.data.Data.pageCount
              this.pageCount ++
              this.List = this.List.concat(res.data.Data.list)
              this.flagWei=false
              this.flagList=true
              if (this.List.length==0) {
                this.emptyFlag = true
                this.flagWei=false
                this.flagList=false
              }else{
                this.emptyFlag = false
                this.flagList=true
              } 
             } //else if (res.data.Status < 0) {
            //   this.delCookie("UserId")
            //   this.delCookie("token")
            //   this.setAccessId('')
            //   location.replace('/')
            // } 
            else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      },
      
      contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i].ID === obj) {
            return true;
          }
        }
        return false;
      },
      ...mapMutations({
        setAccessId: 'SET_ACCESSID',
      })
    }
  }

</script>

<style scoped>
  .scroll-list-wrap {
  height: calc(120vh - 210px);
}
  .CompanyRetrieval {
    background-color: white;
  }

  .retrievaList {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .top {
    width: 100%;
    padding: 15px;
    background: white;
    margin-bottom: 16px;
  }

  .top .search {
    width: 92%;
    height: 44px;
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

  .everSales {
    width: 94%;
    margin: 0 auto;
  }

  .everSales ul {
    width: 100%;

  }

  .everSales ul li {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #ebebeb;
    padding:15px 0;
    overflow: hidden;
  }

  .everSales ul li .number {
    display: block;
    margin-bottom: 0;
    margin-top: 0;
    margin: auto;
    background: rgba(212, 166, 103, 1);
    border-radius: 2px;
    font-size: 10px;
    font-family: PingFangSC-Regular;
    color: rgba(251, 247, 238, 1);
    padding: 0 5px;
    height: 22px;
    line-height: 22px;
  }

  .everSales ul li .name {
    width: 60%;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
  }

  .everSales ul li .person {
    font-size: 12px;
    font-family: PingFangSC-Medium;
    color: rgba(102, 102, 102, 1);
    line-height: 24px;
  }

  .everSales ul li button {
    display: block;
    margin-bottom: 0;
    margin-top: 0;
    margin: auto;
    padding: 0 6px;
    border-radius: 3px;
    font-size: 10px;
    padding: 0 6px;
    height: 26px;
    line-height: 26px;
  }
/* 洽谈中1 */
  .negotiation {
    background: rgba(246, 234, 212, 1);
    color: rgba(187, 159, 97, 1)
  }
/* 签约中2 */
  .contracting {
    background: rgba(251, 193, 180, 1);
    color: #F26F53;
  }
/* 已签约3 */
  .contracted {
    background: rgba(207, 207, 207, 1);
    color: #FFFFFF;
  }
/* 已新建0 */
.new {
  background: rgba(207, 207, 207, 1);
    color: rgba(255, 255, 255, 1);
  }
/* 已放弃-1 */
  .giveUp {
    background: rgba(207, 207, 207, 1);
    color: rgba(255, 255, 255, 1);
  }
/* 已删除-2 */
  .deled {
    background: rgba(207, 207, 207, 1);
    color: rgba(255, 255, 255, 1);
  }

  .weiJiansuo {
    padding-top: 44px;
  }

  .weiJiansuo img {
    display: block;
    width: 201px;
    height: 158px;
    margin: 0 auto;
  }

  .weiJiansuo p {
    text-align: center;
    font-size: 15px;
    color: #b2b2b2;
    padding-top: 6px;
  }

</style>
