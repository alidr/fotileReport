<template>
  <div class="selectMember">
    <div class="SalesmanList">
      <div class="top">
        <div class="search">
          <input type="text" placeholder="请输入业务员姓名或手机号" v-model="memberName">
          <span @click="getList">搜索</span>
        </div>
      </div>
      <div class="everSales">
        <ul>
          <li v-for="(item,index) in list" :key="index">
            <p>{{item.Name}}</p>
            <b>手机号 {{item.Mobile}}</b>
            <span @click="select(item,index)" :class="{active:item.isActive}" ></span>
          </li>
        
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'selectMember',
  computed: {
    ...mapGetters([
      'DealerSelectedMember'
    ])
  },
  data(){
    return{
      list:[],
      // isActive:[],
      idList:[],
      memberName:''
    }
  },
  created(){
    console.log(JSON.parse(localStorage.getItem("select")));
    
    if (JSON.parse(localStorage.getItem("select"))) {
      this.idList=JSON.parse(localStorage.getItem("select"))
        this.getList()
    }else{
      console.log(222)
      this.getList()
    }
  },

  methods:{
    isMemberSelect() {
      this.list.forEach(listItem => {
        this.DealerSelectedMember.forEach(item => {
          if (item.ID === listItem.ID) {
            listItem.isActive = true
          }
        })
      })
      this.list = this.list.slice()
    },
    getList(){
      axios({
        url:this.getHost()+'/UserInfo/GetUserList', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Keyword:this.memberName
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status === 1) {
          this.list = res.data.Data.list
          //判断成员列表是否存在于本地列表
          console.log(this.list, this.DealerSelectedMember);
          this.isMemberSelect()
          // for (let i = 0; i < this.list.length; i++) {
          //   this.isActive.push(false)
          //   if (this.contains(this.idList,this.list[i].ID)) {
          //     this.isActive[i] = true
          //   }
          // }
          // this.isActive =this.isActive.slice()
          
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
    select(item,index){
      console.log(item)
      let list = this.DealerSelectedMember.slice()
      // 已选[], 判断重不重复，不重复push
      let isDup = false
      list.forEach(arrItem => {
        if (item.ID === arrItem.ID) {
          isDup = true
        }
      })
      if (!isDup) {
        list.push(item)
      }
      this.setDealerSelectedMember(list)
      this.isMemberSelect()
      this.$router.replace({
        path:"/newGroup"
        })
        this.$router.go(-1)
      // if (!this.isActive[index]) {
      //   this.idList.push(item)
      //   localStorage.setItem("select",JSON.stringify(this.idList))
      //   this.$router.push({
      //     path:"/newGroup"
      //   })
      // }
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
      setDealerSelectedMember: 'SET_DEALERSELECTEDMEMBER'
    })
  }
}

</script>

<style scoped>
  .SalesmanList {
    width: 100%;
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
    height: 54px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .everSales ul li p {
    width: 40%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    line-height: 54px;
    padding-left: 14px;
  }

  .everSales ul li b {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    line-height: 54px;
    font-weight: normal;
  }

  .everSales ul li span {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin: 18px 18px 18px 8px;
    border: 1px solid #ccc;
    position: relative;

  }
  .everSales ul li span.active{
    border: 1px solid rgba(226, 199, 143, 1)
  }
  .everSales ul li span.active::before{
    background: rgba(226, 199, 143, 1);
  }
  .everSales ul li span::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ccc;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .everSales ul li:nth-child(2) span {
      float: right;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(204, 204, 204, 1);
    line-height: 54px;
    margin-right: 18px;

  }

</style>
