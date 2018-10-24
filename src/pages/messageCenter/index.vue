<template>
<!-- 消息中心 -->
  <div id="messageCenter">
       <div class="scroll-list-wrap">
      <cube-scroll
        ref="scroll"
        :data="list"
        :options="options"
        @pulling-up="onPullingUp">
      <div class="contentList" v-for="(item,index) in list" :key="index">
        <div class="contentListTop">
          <p class="firstLine">
            <span class="status">{{item.TagName}}</span>
            <span>{{item.CreateDate}}</span>
          </p>
          <p class="twoLine">
            <span>{{item.Content}}</span>
            <!-- <span>撤销申诉</span> -->
          </p>
        </div>
        <!-- <div class="contentListBottom">
          <span>待审批／审批中不可撤销</span>
        </div> -->
        <div class="contentListBottom">
          <p class="person">
            审批人：{{item.UserName}}
          </p>
          <p v-if="item.TagID!=2"><a href="javascript:;" to="/companyDetail" @click="companyDetail(item.SourceID)">点击进入公司详情页>></a></p>
        </div>
      </div>
      </cube-scroll>
    </div>
      <empty v-if='emptyFlag'></empty>
      <!-- <div class="lookMore">
        <a href="javascript:;">查看全部</a>
      </div> -->
    </div>

</template>

<script>
import qs from 'qs'
import axios from "axios";
import appealHisList from "../../components/appealHisList";
import empty from '../../components/empty'
export default {
  name: 'messageCenter',
  data(){
    return{
        list:[],
        emptyFlag:false,
        pageCount:1,
        page:1,
        pullUpLoad: false,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '--加载更多--',
        pullUpLoadNoMoreTxt: '--已经到底部了--',
      }
  },
  components:{
    appealHisList,
    empty
  },
  created(){
    this.getList()
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
  methods:{
     onPullingUp() {
          // 更新数据
           if (this.pageCount>=this.page) {
             this.getList(this.page)
           }else{
             this.$refs.scroll.forceUpdate()
           }
        },
    getList(page){
      axios({
        url:this.getHost()+'/UserInfo/GetMessageList', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          page:page||1
        })
      })
      .then(res=>{
        console.log(res)
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
    companyDetail(id){
      this.$router.push({
        path:"/companyDetail",
        query:{
          id:id
        }
      })
    }
  }
}
</script>

<style scoped>
@import '../../common/focusList.css';
.scroll-list-wrap {
  height: calc(100vh - 50px);
}
#messageCenter{
  padding: 15px;
  box-sizing: border-box;
}
.contentListTop,.contentListBottom{
  margin-left: 15px;
}
.firstLine .status{
  position: absolute;
  left: 0px;
  border-radius: 0px 15px 15px 0 !important;
  background-color: #F6EAD4;
  color: #BB9F61;
}
.contentListTop .twoLine span{
  font-size: 14px;
  font-weight: normal;
  line-height: 18px;
}
.contentListBottom .person{
  color: #F26F53;
  width: 0;
  flex-grow: 1;
}
.contentListBottom a{
  color: #4d4d4d;
}
</style>
