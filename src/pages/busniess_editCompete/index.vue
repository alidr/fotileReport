<template>
  <!-- 编辑竞品信息 -->
  <div id="EditCompete">
    <div class="title">
      <span>{{month}}月销售数据</span>
    </div>
    <div class="editTitle">
      <i></i>
      <span>竞品数据</span>
    </div>
    <div class="inputContent">
      <div class="input">
        <span>竞品销量</span>
        <input type="text" placeholder="请输入竞品销量" v-model="SaleCount">
        &nbsp;个
      </div>
      <div class="input">
        <span>竞品开工数</span>
        <input type="text" placeholder="请输入竞品开工数" v-model="WorkCount">
        &nbsp;个
      </div>
      <div class="input">
        <span>竞品出样量</span>
        <input type="text" placeholder="请输入竞品出样量" v-model="SampleCount">
        &nbsp;个
      </div>
      <div class="input">
        <span>门店数量</span>
        <input type="text" placeholder="请输入门店数" v-model="ShopCount">
        &nbsp;个
      </div>
      <div class="input">
        <span>设计师数量</span>
        <input type="text" placeholder="请输入设计师数量" v-model="StylistCount">
        &nbsp;个
      </div>
    </div>
    <div class="editTitle">
      <i></i>
      <span>公司数据</span>
    </div>
    <div class="inputContent">
      <div class="input">
        <span>公司销售金额</span>
        <input type="text" placeholder="请输入公司销售金额" v-model="CompanySaleCount">
        &nbsp;元
      </div>
    </div>
    <a href="javascript:;" id="button" @click="commit">保存</a>
  </div>
</template>

<script>
  import qs from 'qs'
  import axios from "axios";
  export default {
    name: 'EditCompete',
    data() {
      return {
        month: '',
        ID: '',
        year: '',
        SaleCount: '',
        WorkCount: '',
        SampleCount: '',
        ShopCount: '',
        StylistCount: '',
        CompanySaleCount: '', //公司销量
      }
    },
    created() {
      this.month = this.$route.query.month
      this.ID = this.$route.query.id
      this.year = this.$route.query.year || ''
    },
    methods: {
      commit() {
        if (!this.SaleCount) {
          this.getToast("请输入竞品销量", 'warn')
          return
        } else if (!this.WorkCount) {
          this.getToast("请输入竞品开工数", 'warn')
          return
        } else if (!this.SampleCount) {
          this.getToast("请输入竞品出样量", 'warn')
          return
        } else if (!this.ShopCount) {
          this.getToast("请输入门店数量", 'warn')
          return
        } else if (!this.StylistCount) {
          this.getToast("请输入设计师数量", 'warn')
          return
         } else if (!this.CompanySaleCount) {
          this.getToast("请输入公司销售金额", 'warn')
          return
        }
        axios({
            url: this.getHost() + '/Company/CompanyAnalyzeSave',
            method: 'post',
            data: qs.stringify({
              UserId: getCookie('UserId'),
              token: getCookie('token'),
              Month: this.month,
              CompanyID: this.ID,
              Year: this.year,
              SaleCount: this.SaleCount,
              WorkCount: this.WorkCount,
              SampleCount: this.SampleCount,
              ShopCount: this.ShopCount,
              StylistCount: this.StylistCount,
              CompanySaleCount: this.CompanySaleCount
            })
          })
          .then(res => {
            console.log(res)
            if (res.data.Status === 1) {
              this.getToast("编辑成功，返回公司详情页", 'correct')
              setTimeout(() => {
                this.$router.replace({
                  path: '/companyDetail',
                  query: {
                    id: this.ID
                  }
                })
                this.$router.go(-1)
              }, 2000);
            } else if (res.data.Status < 0) {
              this.getToast("登录失效，请重新登录", 'warn')
              setTimeout(() => {
                this.delCookie("UserId")
                this.delCookie("token")
                this.setAccessId('')
                location.replace('/')
              }, 2000);
            } else {
              this.getToast(res.data.Message, 'warn')
            }
          })
      }
    }
  }

</script>

<style scoped>
  @import '../../common/input.css';

  #EditCompete {
    height: 100vh;
    box-sizing: border-box;
    background-color: #fff;
    overflow: hidden;
  }

  .editTitle {
    padding-top: 30px;
    padding-bottom: 4px;
  }

  .editTitle i {
    display: block;
    width: 4px;
    height: 6px;
    background: #D5AE61;
    margin-right: 9px;
    float: left;
    margin-top: 4px;
  }

  .editTitle span {
    font-size: 15px;
    color: #4D4D4D;
    line-height: 16px;
  }

  .inputContent {
    padding: 0 10px;
    overflow: hidden;
  }

  .input {
    box-sizing: border-box;
  }

  .input span {
    margin-left: 4px;
  }

  .title {
    font-weight: 800;
    line-height: 52px;
    color: #4D4D4D;
    font-size: 18px;
    padding-left: 15px;
    box-shadow: 0px 6px 4px 0px rgba(109, 109, 109, 0.04);
  }

  input {
    margin: 0 !important;
  }

  #button {
    width: calc(100% - 80px);
    margin: 0 auto;
    margin-top: 20%;
    
  }

</style>
