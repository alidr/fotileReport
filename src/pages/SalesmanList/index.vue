<template>
  <!-- 业务员列表 -->
  <div class="SalesmanList">
    <div class="top">
      <div class="search">
        <input type="text" placeholder="请输入业务员姓名或手机号" v-model="keyword">
        <span @click="getList()">搜索</span>
      </div>
    </div>
    <div class="everSales">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="select(item.ID)">
          <p>{{item.Name}}</p>
          <b>手机号 {{item.Tel}}</b>
          <span :class="{active:isActive}"></span>
        </li>
      </ul>
    </div>
     <empty v-if='emptyFlag'></empty>
    <!-- 账号管理遮罩 -->
    <div id="mask" v-if="hasMask">
      <div class="maskContain">
        <p class="title">您确定要分配吗</p>
        <div class="btn">
          <span class="cancel" @click="mask(false)">取消</span>
          <span class="confirm" @click="mask(true)">确定</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import empty from "../../components/empty"
export default {
  name: 'SalesmanList',
  data(){
    return{
      list:[],
      isActive:false,
      id:'',
      hasMask:false,
      style:'',
      keyword:'',
      emptyFlag: false,
    }
  },
  created(){  
    this.style = this.$route.query.style||''
    this.getList()
  },
  components:{
    empty
  },
  methods:{
    getList(){
      axios({
        url:this.getHost()+'/Company/SaleList', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          keyword:this.keyword
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.list = res.data.Data.list
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
      .catch(res=>{
        this.getToast(res.data.Message,'warn')
      })
    },
    select(id){
      this.hasMask = true
      this.id = id
    },
    mask(bool){
      if (bool) {
        axios({
          url:this.getHost()+'/Admin/Distribution', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            SaleID:this.id,
            CompanyID:JSON.parse( localStorage.getItem("CompanyID")),
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.hasMask =false
            this.getToast("操作成功",'warn')
            if (this.style==1) {
                this.$router.push({
                path:'/companyList'
              })
            }else{
              this.$router.push({
              path:'/CompanyFollow'
              })
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
      }else{
        this.hasMask = false
      }
    },
  }
}

</script>

<style scoped>
@import '../../common/mask.css';
.title{
  margin-bottom: 15px;
}
.SalesmanList{
width: 100%;
overflow: hidden;
}
.top{
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
.everSales{
width: 90%;
margin: 0 auto;
}
.everSales ul{
width: 100%;

}
.everSales ul li{
width: 100%;
height:54px;
background:rgba(255,255,255,1);
border-radius:8px;
margin-bottom: 12px;
}
.everSales ul li p{
float: left;
font-size:16px;
font-family:PingFangSC-Regular;
color:rgba(102,102,102,1);
line-height:54px;
padding-left: 14px;
margin-right: 25px;
}
.everSales ul li b{
float: left;
font-size:14px;
font-family:PingFangSC-Regular;
color:rgba(102,102,102,1);
line-height:54px;
font-weight: normal;
}
.everSales ul li span{
float: right;
display: block;
width:16px;
height:16px;
border-radius: 50%;
margin: 18px;
border:1px solid #ccc;
position: relative;

}

.everSales ul li span.active{
border:1px solid rgba(226,199,143,1);
}
.everSales ul li span.active::before{

background:rgba(226,199,143,1);
}
.everSales ul li span::before{
content:'';
width: 14px;
height: 14px;
border-radius: 50%;
background:#ccc;
position: absolute;
top: 0;bottom: 0;left: 0;right: 0;
margin: auto;


}

</style>
      