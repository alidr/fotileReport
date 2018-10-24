<template>
  <!-- 新建小组 -->
    <!-- 新建小组 -->
  <div class="newGroup">
    <div class="memberGroup">
        <span>选择组员</span>
      <ul>
        <li v-for="(item,index) in DealerSelectedMember" :key="index">
          <p>{{index+1}}
            <span>{{item.Name}}</span></p>
          <button type="button" v-show="zuzhangId !== item.ID" @click="setZuZhang(item.ID)">设置为组长</button>
          <button type="button"  class="zuzhang" v-show="zuzhangId === item.ID" @click="setZuZhang(item.ID)">组长</button>
          <img src="./del_03.png" alt="" @click="deleteMember(item.ID)">
        </li>
       
      </ul>
    </div>
    <button type="button" class="addMember" @click="addMember">＋添加组员</button>
    <div class="bottom">
      <div class="title">申请说明</div>
      <textarea name="" id="" cols="30" rows="6" placeholder="请输入小组申请说明" v-model="detail"></textarea>
    </div>
    <button type="button" class="submit" @click="commit">提交审核</button>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import qs from 'qs'
  import axios from "axios";

  export default {
    name: 'newGroup',
    data(){
      return{
        detail:'',
        memberList:[],
      }
    },
    computed: {
      zuzhangId() {
        let zuzhang = this.DealerSelectedMember.filter(item => {
          return item.isZuZhang
        })
        if (zuzhang.length) {
          return zuzhang[0].ID
        } else {
          return null
        }
      },
      ...mapGetters([
        'DealerSelectedMember'
      ])
    },
    created(){
      
      this.detail =  sessionStorage.getItem("detail")||""
      sessionStorage.removeItem("detail")
    },
    methods:{
      commit(){
      if (this.DealerSelectedMember.length==0) {
        this.getToast("请选择组员",'warn')
        return
      }else{
        console.log(this.memberList);
        this.memberList = []
        this.DealerSelectedMember.forEach(item => {
            this.memberList.push({
              "UserId":item.ID,
              "IsHead":item.isZuZhang
            })
        });
      }
      if (!this.detail) {
        this.getToast("请输入申请理由",'warn')
        return
      }
      axios({
        url:this.getHost()+'/UserInfo/GroupUserSave', 
        method:'post',
        data:qs.stringify({
          UserId:getCookie('UserId'),
          token:getCookie('token'),
          Reason:this.detail,
          itemList:this.memberList
        })
      })
      .then(res=>{
        console.log(res)
        if (res.data.Status===1) {
          this.detail = ""
          this.setDealerSelectedMember([])
          this.getToast("创建成功",'warn')
          setTimeout(() => {
            this.$router.push({
              path:'/allgroups'
            })
          }, 2000);
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
      setZuZhang(id) {
        let list = this.DealerSelectedMember.slice()
        list = list.map(item => {
          item.isZuZhang = item.ID === id
          return item
        })
        this.setDealerSelectedMember(list)
      },
      addMember(){
        sessionStorage.removeItem("detail")
        sessionStorage.setItem("detail",this.detail)
        this.$router.push({
          path:"/selectMember"
        })
      },
      deleteMember(ID){
        let list = this.DealerSelectedMember.slice()
        list = list.filter(item => {
          return item.ID !== ID
        })
        if (ID === this.zuzhang) {
          this.zuzhang = null
        }
        this.setDealerSelectedMember(list)
        // for (let i = 0; i < this.list.length; i++) {
        //   if (this.list[i].ID==ID) {
        //     this.list.splice(i)
        //   }
        // }
        // this.list = this.list.slice()
        // localStorage.setItem("select",JSON.stringify(this.list))

        // setTimeout(() => {
        //   this.getList()
        //   this.list = this.list.slice()
        // // this.list = JSON.parse(localStorage.getItem("select"))
        // console.log(JSON.parse(localStorage.getItem("select")));
        // }, 1000);
        // // this.$router.go(0)
      },
      ...mapMutations({
        setDealerSelectedMember: 'SET_DEALERSELECTEDMEMBER'
      })
    }
  }

</script>

<style scoped>
  .zuzhang{
  background-image:  -webkit-gradient(linear, left top, right top, from(#E2C78F), to(#D5AE61))
  }
 .newGroup {
    width: 100%;
    overflow: hidden;
  }

  .memberGroup {
    width: 100%;
    margin-top: 12px;
    background: white;

  }

  .memberGroup ul {
    width: 96%;
    margin: 0 auto;
  }

  .memberGroup ul li {
    border-top: 1px solid #B1B1B1;
    height: 46px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    line-height: 46px;
    display: flex;
    align-items: center;

  }

  .memberGroup ul li button {

    display: block;
    border-radius: 4px;
    padding: 0 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 26px;
    margin-right: 14px;
    margin-top: 8px;
    background-color: #ccc;
  }

  .memberGroup ul li img {

    display: block;
    width: 30px;
    height: 30px;
    margin-top: 8px;
  }
  .memberGroup ul li p {
    flex-grow: 1;
    width: 0;
  }
  .memberGroup ul li p span{
    display: inline-block;
    margin-left: 15px;
  }
  .memberGroup>span {
    width: 96%;
    display: inline-block;
    margin: 0 auto;
    line-height: 46px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(77, 77, 77, 1);
    padding-left:15px;
    box-sizing: border-box;
  }


  /* .memberGroup ul li button {
    background: #E2C78F;
  } */


  
  .newGroup .addMember {
    display: block;
    width: 100%;
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(128, 128, 128, 1);
    background-color: #f5f5f5;

  }

  .bottom {
    padding: 0 16px;
    height: 300px;
    margin: 0 auto;
    background: white;
    margin-bottom: 15px
  }

  .bottom .title {
    width: 98%;
    height: 46px;
    border-bottom: 1px solid #B1B1B1;
    line-height: 46px;
    margin: 0 auto;

  }

  .bottom textarea {
    padding-top: 14px;
    padding-left: 4px;
    width: 100%;
    /* text-indent: 1em; */
  }

  .bottom textarea::placeholder {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(204, 204, 204, 1);

  }

  .submit {
    display: block;
    width: 80%;
    height: 40px;
    margin: 0 auto;
    border-radius: 20px;
    box-shadow: 6px 10px 15px rgba(223, 174, 72, 0.2);
    background: linear-gradient(left, #E2C78F, #D5AE61);
    font-size: 14px;
    font-family: PingFangSC-Regular;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    margin-bottom: 15px;
  }

</style>
