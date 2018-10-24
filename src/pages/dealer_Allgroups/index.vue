<template>
  <!-- 所有小组 -->
  <div class="allgroups">
    <div class="top">
      <p>当前一共有
        <span>{{list.length}}</span>个小组</p>
      <router-link to='/newGroup'>
        <button type="button">新建小组</button>
      </router-link>
    </div>
    <div class="groupList">
      <ul>
        <li v-for="(item,index) in list" :key="index">
            <span>{{item.StatusName}}</span>
          <div class="left">
            <i></i>
            <span>小组{{index+1}}</span>
          </div>
          <div class="right">
            <i></i>
            <p>组长
              <span class="smallName">{{item.Name}}</span><span>{{item.Mobile}}</span>
            </p>
            <b>该小组组员{{item.Count}}人，共跟进{{item.TotalCount}}个家装公司</b>
            
          </div>
          <a href="javascript:;" @click="groupList(item.ID)">
              <button type="button">详情</button>

          </a>
        </li>
      </ul>
      <empty v-if='emptyFlag'></empty>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
import { mapGetters, mapMutations } from 'vuex';
import empty from '../../components/empty'

  export default {
    name: 'allgroups',
    data(){
      return{
        list:[],
        emptyFlag:false
      }
    },
    components:{
      empty
    },
    created(){
      this.getList()
      this.setDealerSelectedMember([])
    },
    methods:{
      getList(){
        //获取所有小组
        axios({
        url:this.getHost()+'/UserInfo/GetGroupList', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token')
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.list = res.data.Data.list
            if (this.list == '') {
                this.emptyFlag = true
              } else {
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
      groupList(id){
        this.$router.push({
          path:'/myGroup',
          query:{
            id:id,
            style:1
          }
        })
      },
      ...mapMutations({
        setDealerSelectedMember: 'SET_DEALERSELECTEDMEMBER'
      })
    }
  }

</script>

<style scoped>
  .allgroups {
    width: 94%;
    overflow: hidden;
    margin: 0 auto;

  }

  .top {
    width: 100%;
    overflow: hidden;
    padding-top: 14px;
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .top p {
    /* float: left; */
    /* display: block; */
    width: 60%;
    height: 24px;
    background: rgba(223, 222, 221, 1);
    font-size: 12px;
    font-family: PingFangSC-Light;
    color: rgba(255, 255, 255, 1);
    line-height: 24px;
    padding-left: 14px;
    margin-top: 2px;
    flex-grow: 1;
    width: 0;
    margin-right: 15px;
  }

  .top a button {
    /* float: right; */
    height: 28px;
    background: rgba(226, 199, 143, 1);
    border-radius: 3px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 28px;
    text-align: center;
    padding: 0 18px;

  }

  .groupList {
    width: 100%;
    overflow: hidden;
  }

  .groupList ul li {
    width: 100%;
    overflow: hidden;
    padding:20px 10px 10px;
    background: white;
    border-radius: 4px;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box
  }

  .groupList ul li .left {
    /* float: left; */
    overflow: hidden;
    margin-right: 10px;
  }

  .groupList ul li>span {
    display: block;
    height: 20px;
    background: rgba(246, 234, 212, 1);
    border-radius: 0px 10px 10px 0px;
    padding: 0 14px;
    margin-bottom: 6px;
    font-size: 10px;
    font-family: PingFangSC-Regular;
    color: rgba(187, 159, 97, 1);
    line-height: 20px;
    text-align: center;
    position: absolute;
    top: 2px;
    left: 0;
  }

  .groupList ul li .left span {
    font-size: 14px;
    font-family: PingFangSC-Light;
    color: rgba(102, 102, 102, 1);
    line-height: 10px;
  }

  .groupList ul li .left i {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: rgba(235, 232, 228, 1);
    border-radius: 50%;
    line-height: 10px;
    margin-top: 6px;
  }

  .groupList ul li .right {
    overflow: hidden;
    border-left: 1px solid #f0f0f0;
    padding: 0 10px;
    flex-grow: 1;
    width: 0;
  }

  /* .groupList ul li .right i::after {
    content: "";
    display: block;
    width: 1px;
    height: 28px;
    background: rgba(238, 238, 238, 1);
    margin-right: 8px;
    margin-top: 6px;

  } */

  .groupList ul li .right p {
    /* float: left; */
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(102, 102, 102, 1);
    line-height: 20px;
    display: flex;
  }
  .smallName{
    display: block;
    width: 18%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 4px;
  }
  .groupList ul li .right b {
    /* float: left; */
    font-size: 12px;
    font-family: PingFangSC-Light;
    color: rgba(179, 179, 179, 1);
    font-weight: normal;
  }

  .groupList ul li a>button {
    width: 30px;
    height: 30px;
    background: rgba(226, 199, 143, 1);
    border-radius: 50%;
    font-size: 10px;
    font-family: PingFangSC-Light;
    color: rgba(255, 255, 255, 1);
    line-height: 28px;
    text-align: center;
    margin-left: 6px;
  }

</style>
