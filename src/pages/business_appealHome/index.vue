<template>
<!-- 我要申诉 -->
  <div id="business_appealHome">
    <div class="appealTop">
      <div class="input">
        <span>家装公司全称<i>*</i></span>
        <input type="text" placeholder="请输入家装公司全称" v-model="name">
      </div>
      <div class="next">
        <a href="javascript:;"  id="button" @click="nextStep">下一步</a>
      </div>
    </div>
    <div class="input inputTitle">
      <span class="title">申诉历史</span>
    </div>

    
    <div class="appealHis">
      <div class="scroll-list-wrap">
      <cube-scroll
        ref="scroll"
        :data="applyHistoryList"
        :options="options"
        @pulling-up="onPullingUp">
      <div class="home_content">
      <div class="contentList" v-for="(item,index) in applyHistoryList" :key="index">
        <div class="contentListTop">
          <p class="firstLine">
            <span class="status" :class="{red:item.TypeID==1,yellow:item.TypeID==2,grey:item.TypeID==3}">{{item.TypeName}}</span>
            <span>申诉日期:{{item.CreateDate}}</span>
          </p>
          <p class="twoLine">
            <span>{{item.CompanyName}}</span>
            <span v-if="item.Status == 0" @click="deleteShopMask(true,item.ID)">撤销申诉</span>
          </p>
        </div>
        <!-- <div class="contentListBottom">
          <span>待审批／审批中不可撤销</span>
        </div> -->
        <div class="contentListBottom">
          <p>
            <span v-if="item.Status==-1">{{item.ResultDate}}</span>
            <span class="appealStatus">{{item.StatusName}}</span>
            <!-- <span class="appealStatus" v-if="item.Status == 1">审批中</span> -->
            <span id="lookDetail" @click="applyDetail(item.ID)">查看申诉详情>></span>
          </p>
          <p v-if="item.Status==-1" class="Reson">原因:&emsp;{{item.Result}}</p>
        </div>
      </div>
      <!-- <div class="lookMore">
        <a href="javascript:;">查看全部</a>
      </div> -->
    </div>
  </cube-scroll>
      </div>
    </div>
    <div id="mask" v-show="deleteShopWarn">
      <div class="maskContain">
        <div class="content">
          确认撤销吗？
        </div>
        <div class="btn">
          <span class="cancel" @click="deleteShopMask(false)">取消</span>
          <span class="confirm" @click="cancel()">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appealHisList from "../../components/appealHisList";
import axios from "axios"
import qs from "qs";
export default {
  name: 'business_appealHome',
  components:{
    appealHisList
  },
  data () {
    return {
      test: '111',
      data:null,
      name:'',
      applyHistoryList: [],
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
  created () {
    this.getData();
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
  }
},
  methods: {
     onPullingUp() {
          // 更新数据
           if (this.pageCount>=this.page) {
             this.getData(this.page)
           }else{
             this.$refs.scroll.forceUpdate()
           }
        },
    deleteShopMask(bool,ID){
      this.deleteShopWarn = bool;
      this.shopID = ID||""
    },
    applyDetail(id){
        console.log(id);
        
        this.$router.push({
          path:'/appealDetails',
          query:{
            id:id
          }
        })
      },
    nextStep () {
      if (!this.name) {
        this.getToast("请输入公司名称",'warn')
        return
      }
      axios({
        url:this.getHost()+'/Approval/GetCompanyByName', 
        method:'post',
        data:qs.stringify({
          // 拿到用户id和token
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Name: this.name
        })
      })
      .then(res=>{
        
        if (res.data.Status===1) {
          console.log(res);
          
          this.data = res.data.Data
          this.$router.push({path: '/appealStyle', query: {
            id: this.data.CategoryID,
          }});
          sessionStorage.setItem("companyName",this.name)
          sessionStorage.setItem("ID",this.data.ID)
          sessionStorage.setItem("Address",this.data.Address)
          sessionStorage.setItem("CategoryName",this.data.CategoryName)
          sessionStorage.setItem("UserID",this.data.UserID)
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
      .catch(res=>{
        this.getToast(res.data.Message,'warn')
      })
      
    },
    getData (page) {
      axios({
        url:this.getHost()+'/Approval/ApplyHistory', 
        method:'post',
        data:qs.stringify({
          // 拿到用户id和token
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          page:page||1
        })
      })
      .then(res=>{
        
        if (res.data.Status===1) {
            this.pageCount = res.data.Data.pageCount
                if (this.page==1) {
                  this.applyHistoryList = res.data.Data.list
                }else{
               if (this.applyHistoryList.length>0&&this.page>1) {
                  // 如果有新数据
                  // let newPage = _foods.slice(0, 5)
                  this.applyHistoryList = this.applyHistoryList.concat(res.data.Data.list)
                  
                }
                }
              this.page++
          // this.applyHistoryList = res.data.Data.list;
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
      .catch(res=>{
        this.getToast(res.data.Message,'warn')
      })
    },
    cancel(){
      axios({
        url:this.getHost()+'/Approval/CancelApply', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Id:this.shopID
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.getToast("操作成功",'warn')
          this.deleteShopMask(false)
          this.getData()
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
    }
  }
}
</script>

<style scoped>
@import '../../common/input.css';
@import '../../common/focusList.css';
@import '../../common/mask.css';
/*  */
.scroll-list-wrap {
  height: calc(100vh - 250px);
}
.contentListBottom span:nth-child(3){
  color: #666;
  font-size: 12px;
}
#lookDetail{
  position: absolute;
  right: 15px;
}
.Reson{
  margin-top: 5px;
}
.contentList{
  padding-left: 20px;
}
.contentListTop,
.contentListBottom{
  margin-left: 0;
}
.contentListBottom{
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.contentListBottom p{
  display: flex;
}
.contentListBottom p>span,
.contentListBottom .appealStatus{
  width: auto !important;
  flex-grow: 1;
}
.contentListBottom .appealStatus{
  font-weight: 600;
  font-size: 14px;
}
.home_content{
  padding-top: 10px;
}
.firstLine .status{
  /* background-color: #fff !important; */
  /* border:1px solid #BB9F61; */
  /* color: #BB9F61; */
  margin-left: 5px !important;
}
.appealTop{
  padding: 20px 0 0;
}
.next{
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
}
#button{
  width: 100%;
}
.input.inputTitle{
  height: 50px;
}
.input .title{
  color: #4D4D4D;
  font-size: 18px;
  font-weight: 600;
}
.contentListBottom span:nth-child(2){
  height: 15px;
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
