<template>
    <div class="companyContract">
        <div class="top">
            <img src="./images/111_03.png" alt="">
            <p>该公司曾被放弃跟进，请确认是否继续跟进！确认后公司将进入到您的跟进列表！</p>
        </div>
        <div class="btn">
            <button type="button" class="giveUp" @click="giveUp">放弃，返回首页</button>
            <button type="button" class="sure" @click="commitInfo">确认添加</button>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import axios from "axios";
export default {
name: 'companyContract',
created(){
    this.CategoryID = this.$route.query.CategoryID
    this.Name = this.$route.query.Name
    console.log(this.Name );
},
methods:{
    giveUp(){
        this.$router.push({
        path:'/home'
        })
    },
    commitInfo(){
        axios({
          url:this.getHost()+'/Company/CompanySave', 
          method:'post',
          data:qs.stringify({
            UserId:getCookie('UserId'),
            token:getCookie('token'),
            ID:0,
            CategoryID:this.CategoryID,
            Name:this.Name,
            ShortName:'',
            Area:'',
            Address:'',
            Status:'',
            UserName:'',
            JobName:'',
            Mobile:'',
            UserAddress:'',
            Remark:'',
            HeadImageUrl:'',
          })
        })
        .then(res=>{
          console.log(res)
          if (res.data.Status===1) {
            this.getToast("操作成功,跳转首页",'correct')
            setTimeout(() => {
              if (this.AccessId==-1) {
                this.$router.push({path:"/adminIndex"})
              }else{
                this.$router.push({path:"/home"})
              }
            }, 2000);
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
      }
    }
}
</script>
      
<style scoped>
.companyContract{
width: 100%;
overflow: hidden;
}
.top{
background: #fff5e7;
padding: 12px 22px;
position: fixed;
top: 0;left: 0;
}
.top img{
float: left;
display: block;
width: 22px;
height: 22px;
margin-right: 14px;
}
.top p{
font-size: 14px;
color: #f07058;
}
.btn{
width: 80%;
position: fixed;
bottom: 0;left: 0;right: 0;margin: auto;
padding-bottom: 38px;
}
.btn button{
width: 100%;
height: 40px;
border-radius: 20px;
margin-bottom: 12px;

}
.btn .giveUp{
background: #d4d4d4;
font-size: 14px;
color: white;
text-align: center;
line-height: 40px;
box-shadow: 0px 6px 10px #ebeae9;
}
.btn .sure{
background: #d4d4d4;
font-size: 14px;
color: white;
text-align: center;
line-height: 40px;
background: linear-gradient(left,#E2C78F,#D5AE61);
box-shadow: 0px 6px 10px rgba(223, 174, 72, 0.2);
}

</style>